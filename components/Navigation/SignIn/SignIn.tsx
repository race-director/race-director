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
      throw new Error(
        "Race Director is on invite-only mode. Contact me for an invite."
      );
      // if (username && email && password) {
      //   const { user } = await createUserWithEmailAndPassword(
      //     auth,
      //     email,
      //     password
      //   );
      //   const userRef = doc(getFirestore(firebaseApp), `users/${user.uid}`);
      //   let newUser: user = {
      //     email: email,
      //     uid: user.uid,
      //     displayName: username,
      //     photoURL: FALLBACK_PHOTO_URL,
      //     bio: "",
      //     followers: 0,
      //     following: 0,
      //   };
      //   await setDoc(userRef, newUser, { merge: true });
      //   setState(null);
      // } else {
      //   if (!username) {
      //     throw new Error("Race Director: Username is required");
      //   }
      //   if (!email) {
      //     throw new Error("Race Director: Email is required");
      //   }
      //   if (!password) {
      //     throw new Error("Race Director: Password is required");
      //   }
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
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setState("signup")}
                    >
                      <p className="text-lg font-bold uppercase">Signup</p>
                      {state === "signup" && (
                        <motion.div
                          layoutId="sign-in-selector"
                          className="h-0.5 w-full absolute top-full bg-red-500"
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
                          className="h-0.5 w-full absolute top-full bg-red-500"
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
                      className="fill-zinc-200 h-8 w-8 cursor-pointer hover:scale-110 active:scale-90 transform transition-transform"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                    </svg>
                  </div>
                </div>
                <div className="pt-6 pb-2 grid gap-3">
                  <p className="text-zinc-200">
                    {state === "signup"
                      ? "Join the Race Director community!"
                      : "Login to your Race Director account"}
                  </p>
                  <div className="grid gap-2 pt-2">
                    {state === "signup" && (
                      <div className="grid gap-0.5">
                        <label className="font-base text-zinc-200/80 text-sm">
                          Username
                        </label>
                        <input
                          className="w-full p-2 rounded-lg bg-zinc-700"
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
                          ? "grid sm:grid-cols-2 grid-cols-1 gap-2"
                          : "grid gap-2"
                      }`}
                    >
                      <div className="grid gap-0.5">
                        <label className="font-base text-zinc-200/80 text-sm">
                          Email
                        </label>
                        <input
                          className="w-full p-2 rounded-lg bg-zinc-700"
                          type="email"
                          placeholder=""
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="font-base text-zinc-200/80 text-sm">
                          Password
                        </label>
                        <input
                          className="w-full p-2 rounded-lg bg-zinc-700"
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
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 pt-1">
                    <button
                      onClick={close}
                      className="bg-zinc-700 hover:bg-zinc-600 active:scale-90 transform transition-all py-2 uppercase font-bold text- rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={state === "signup" ? signUp : signIn}
                      className="bg-red-600 text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
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
