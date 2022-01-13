import { getAuth, signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { Auth as AuthContext, DarkMode } from "../../../pages/_app";
import { firebaseApp } from "../../../utils/firebase";
import { SignIn } from "../SignIn";

interface AuthProps {}

const FALLBACK_PHOTO_URL =
  "https://firebasestorage.googleapis.com/v0/b/race-director.appspot.com/o/assets%2FFallback_img.jpeg?alt=media&token=a70a5d9c-b2ba-4040-bf33-f252bc5f2b45";

const Auth: React.FC<AuthProps> = () => {
  const [user, loading] = useContext(AuthContext);
  const [expandedMenuState, setExpandedMenuState] = useState(false);
  const [signInState, setSignInState] = useState<"signup" | "login" | null>(
    null
  );
  const photoUrl = user?.photoURL ?? FALLBACK_PHOTO_URL;
  const toggleDarkMode = useContext(DarkMode);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      {!loading && (
        <>
          <div></div>
          <div className="relative">
            <div
              onClick={() => setExpandedMenuState(!expandedMenuState)}
              className="flex space-x-0 items-center justify-center"
            >
              <img
                className="rounded-full h-8 w-8"
                src={photoUrl}
                alt="Profile"
              />
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
                  className="absolute w-72 bg-zinc-800 rounded-lg shadow-lg top-full right-0 mt-4 overflow-hidden"
                >
                  <div className="p-8">
                    {user ? (
                      <div className="grid gap-4">
                        <div className="flex items-center space-x-3">
                          <img
                            className="rounded-full h-12 w-12"
                            src={photoUrl}
                            alt="Profile"
                          />
                          <p className="uppercase tracking-tighter text-zinc-200/90 font-semibold">
                            {user.displayName}
                          </p>
                        </div>
                        <div className="grid text-zinc-200">
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
      )}
    </>
  );
};

export default Auth;
