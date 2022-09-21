import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { user } from "../../../types";
import { firebaseApp } from "../../../utils/firebase";
import { toTitleCase } from "../../../utils/other";
import { Backdrop, Modal } from "../../Menus";
import { FALLBACK_PHOTO_URL } from "../Auth/Auth";

interface SignInProps {
  signInState: [
    "signup" | "login" | null,
    React.Dispatch<React.SetStateAction<"signup" | "login" | null>>
  ];
}

const SignIn: React.FC<SignInProps> = ({ signInState }) => {
  const [state, setState] = signInState;
  const close = () => setState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<null | FirebaseError>();

  useEffect(() => {
    if (!state) {
      setEmail("");
      setPassword("");
      setUsername("");
      setError(null);
    }
  }, [state]);

  const signIn = async () => {
    const auth = getAuth(firebaseApp);
    try {
      if (email && password) {
        await signInWithEmailAndPassword(auth, email, password);
        setState(null);
      } else {
        if (!email) {
          throw new Error("Race Director: Email is required");
        }
        if (!password) {
          throw new Error("Race Director: Password is required");
        }
      }
    } catch (err) {
      setError(err as FirebaseError);
    }
  };

  const signUp = async () => {
    const auth = getAuth(firebaseApp);
    try {
      // if (process.env.NODE_ENV === "development") {
        if (username && email && password) {
          const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const userRef = doc(getFirestore(firebaseApp), `users/${user.uid}`);
          let newUser: user = {
            email: email,
            uid: user.uid,
            displayName: username,
            photoURL: FALLBACK_PHOTO_URL,
            bio: "",
            followers: 0,
            following: 0,
          };
          await setDoc(userRef, newUser, { merge: true });
          setState(null);
        } else {
          if (!username) {
            throw new Error("Race Director: Username is required");
          }
          if (!email) {
            throw new Error("Race Director: Email is required");
          }
          if (!password) {
            throw new Error("Race Director: Password is required");
          }
        }
      // } else {
      //   throw new Error(
      //     "Race Director is on invite-only mode. Contact me for an invite."
      //   );
      // }
    } catch (error) {
      setError(error as FirebaseError);
    }
  };

  return (
    <>
      <AnimatePresence>
        {state && (
          <Backdrop onClick={() => setState(null)}>
            <Modal>
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setState("signup")}
                    >
                      <p className="text-lg font-bold uppercase">Signup</p>
                      {state === "signup" && (
                        <motion.div
                          layoutId="sign-in-selector"
                          className="absolute top-full h-0.5 w-full bg-red-500"
                        ></motion.div>
                      )}
                    </div>
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setState("login")}
                    >
                      <p className="text-lg font-bold uppercase">Login</p>
                      {state === "login" && (
                        <motion.div
                          layoutId="sign-in-selector"
                          className="absolute top-full h-0.5 w-full bg-red-500"
                        ></motion.div>
                      )}
                    </div>
                  </div>
                  <div>
                    <svg
                      onClick={close}
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#000000"
                      className="h-8 w-8 transform cursor-pointer fill-zinc-200 transition-transform hover:scale-110 active:scale-90"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                    </svg>
                  </div>
                </div>
                <div className="grid gap-3 pt-6 pb-2">
                  <p className="text-zinc-200">
                    {state === "signup"
                      ? "Join the Race Director community!"
                      : "Login to your Race Director account"}
                  </p>
                  <div className="grid gap-2 pt-2">
                    {state === "signup" && (
                      <div className="grid gap-0.5">
                        <label className="font-base text-sm text-zinc-200/80">
                          Username
                        </label>
                        <input
                          className="w-full rounded-lg bg-zinc-700 p-2"
                          type="text"
                          placeholder=""
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    )}
                    <div
                      className={`${
                        state === "signup"
                          ? "grid grid-cols-1 gap-2 sm:grid-cols-2"
                          : "grid gap-2"
                      }`}
                    >
                      <div className="grid gap-0.5">
                        <label className="font-base text-sm text-zinc-200/80">
                          Email
                        </label>
                        <input
                          className="w-full rounded-lg bg-zinc-700 p-2"
                          type="email"
                          placeholder=""
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="font-base text-sm text-zinc-200/80">
                          Password
                        </label>
                        <input
                          className="w-full rounded-lg bg-zinc-700 p-2"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="pt-1"
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                      >
                        <p className="font-semibold text-red-500">
                          Error: {toTitleCase(error.message)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                    <button
                      onClick={close}
                      className="text- transform rounded-md bg-zinc-700 py-2 font-bold uppercase transition-all hover:bg-zinc-600 active:scale-90"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={state === "signup" ? signUp : signIn}
                      className="transform rounded-md bg-red-600 py-2 text-center font-bold uppercase transition-all hover:bg-red-700 active:scale-90"
                    >
                      {state === "signup" ? "Signup" : "Login"}
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  );
};

export default SignIn;
