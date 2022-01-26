import { getAuth, signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { Auth as AuthContext, DarkMode } from "../../../pages/_app";
import { firebaseApp } from "../../../utils/firebase";
import { Backdrop, Modal } from "../../Menus";
import { SignIn } from "../SignIn";

interface AuthProps {}

/**
 * Default profile picture hosted on Firebase Storage Bucket
 */
export const FALLBACK_PHOTO_URL =
  "https://firebasestorage.googleapis.com/v0/b/race-director.appspot.com/o/assets%2FFallback_img.jpeg?alt=media&token=a70a5d9c-b2ba-4040-bf33-f252bc5f2b45";

const Auth: React.FC<AuthProps> = () => {
  const [user, loading] = useContext(AuthContext);
  const [expandedMenuState, setExpandedMenuState] = useState(false);
  const [signInState, setSignInState] = useState<"signup" | "login" | null>(
    null
  );
  const photoUrl = user?.photoURL ?? FALLBACK_PHOTO_URL;
  const [toggleDarkMode, darkMode] = useContext(DarkMode);

  return (
    <>
      <AnimatePresence>
        {!darkMode && (
          <Backdrop onClick={() => toggleDarkMode()}>
            <Modal>
              <div className="p-8 grid gap-4">
                <h1 className="text-xl text-zinc-200/90 font-bold uppercase">
                  Light mode is still not available.
                </h1>
                <p className="text-zinc-200/70">It will be, just not yet</p>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 pt-2 text-zinc-200">
                  <button
                    onClick={() => toggleDarkMode()}
                    className="bg-zinc-700 hover:bg-zinc-600 active:scale-90 transform transition-all py-2 uppercase font-bold text- rounded-md"
                  >
                    Okay
                  </button>
                  <button
                    onClick={() => toggleDarkMode()}
                    className="bg-red-600 text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
      {!loading ? (
        <>
          <div className="relative">
            <div
              onClick={() => setExpandedMenuState(!expandedMenuState)}
              className="flex space-x-0 items-center justify-center"
            >
              <div className="rounded-full h-8 w-8 border-2 dark:border-zinc-200/80 border-zinc-700/80 overflow-hidden">
                <Image height={32} width={32} src={photoUrl} alt="Profile" />
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
                className={`fill-blue-400 h-5 w-5 transform transition-transform ${
                  expandedMenuState ? "rotate-180" : ""
                }`}
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
            <AnimatePresence>
              {expandedMenuState && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute w-72 dark:bg-zinc-800 bg-zinc-100 rounded-lg shadow-lg top-full right-0 mt-4 overflow-hidden"
                >
                  <div className="px-4 py-6">
                    {user ? (
                      <div className="grid gap-4">
                        <Link href={`/u/${user.uid}`}>
                          <a className="flex items-center space-x-3 cursor-pointer dark:hover:bg-zinc-700 hover:bg-zinc-200 px-4 py-2 rounded-md transition-colors">
                            <div className="rounded-full border-2 dark:border-zinc-200/80 border-zinc-700/80 h-12 w-12 overflow-hidden">
                              <Image
                                height={48}
                                width={48}
                                src={photoUrl}
                                alt="Profile"
                              />
                            </div>
                            <p className="uppercase tracking-tighter dark:text-zinc-100/90 text-zinc-800/80 font-semibold">
                              {user.displayName}
                            </p>
                          </a>
                        </Link>
                        <div>
                          <ul className="text-zinc-700/80 dark:text-zinc-200/80">
                            <li
                              onClick={toggleDarkMode}
                              className="flex relative px-12 py-1 dark:hover:bg-zinc-700 hover:bg-zinc-200 transition-colors font-semibold overflow-hidden rounded-md cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                enableBackground="new 0 0 24 24"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="#000000"
                                className={`fill-zinc-900/80 absolute transition-all ${
                                  darkMode
                                    ? "-left-10 opacity-0"
                                    : "left-4 opacity-100"
                                }`}
                              >
                                <rect fill="none" height="24" width="24" />
                                <path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26 c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
                              </svg>

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                enableBackground="new 0 0 24 24"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="#000000"
                                className={`fill-yellow-300/80 absolute transition-all ${
                                  darkMode
                                    ? "left-4 opacity-100"
                                    : "-left-10 opacity-0"
                                }`}
                              >
                                <rect fill="none" height="24" width="24" />
                                <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
                              </svg>
                              <span>
                                {darkMode ? "Light Mode" : "Dark Mode"}
                              </span>
                            </li>
                            <li className="flex relative px-12 py-1 dark:hover:bg-zinc-700 hover:bg-zinc-200 transition-colors font-semibold overflow-hidden rounded-md cursor-pointer">
                              <Link href={"/studio"}>
                                <a className="w-full">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    width="24px"
                                    fill="#000000"
                                    className="absolute left-4 fill-red-600/80"
                                  >
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                                  </svg>
                                  <span>Studio</span>
                                </a>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="grid text-zinc-200 px-4 pt-2">
                          <button
                            onClick={() => signOut(getAuth(firebaseApp))}
                            className="bg-red-600 text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-zinc-200 grid grid-cols-1 gap-4">
                        <p className="text-sm italic text-zinc-200/70 text-center">
                          Sign in to Race Director to customise your feed and
                          enjoy a better experience
                        </p>
                        <div className="grid grid-cols-1 gap-1.5">
                          <button
                            onClick={() => setSignInState("signup")}
                            className="bg-red-600 text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
                          >
                            Sign Up
                          </button>
                          <button
                            onClick={() => setSignInState("login")}
                            className="bg-zinc-600 hover:bg-zinc-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
                          >
                            Login
                          </button>
                          <SignIn
                            signInState={[signInState, setSignInState]}
                          ></SignIn>
                        </div>
                      </div>
                    )}
                    {/* <div>
                        <button onClick={toggleDarkMode}>
                          Toggle dark mode
                        </button>
                      </div> */}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-full h-8 w-8 overflow-hidden"></div>
        </>
      )}
    </>
  );
};

export default Auth;
