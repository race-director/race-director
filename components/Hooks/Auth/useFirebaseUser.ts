import { FirebaseApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { user } from "../../../types";
import { FALLBACK_PHOTO_URL } from "../../Navigation/Auth/Auth";

const useFirebaseUser = (app: FirebaseApp): [user, boolean] => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [authUser, loading] = useAuthState(auth);
  const [firebaseUser, setFirebaseUser] = useState<user>(null);
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(true);

  const setUserData = async (user: User) => {
    const userRef = doc(db, `users/${user.uid}`);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setFirebaseUser(userDoc.data() as user);
      setFirebaseLoading(false);
    } else {
      const newUser: user = {
        email: user.email,
        uid: user.uid,
        bio: "",
        displayName: "",
        photoURL: FALLBACK_PHOTO_URL,
        followers: 0,
        following: 0,
      };
      setDoc(userRef, newUser, { merge: true });
      setFirebaseUser(newUser);
      setFirebaseLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      // Still loading
      setFirebaseLoading(true);
    } else {
      if (authUser) {
        // User Found => get his data and set it
        setUserData(authUser);
      } else {
        // User Not Found => clear loaded user
        setFirebaseUser(null);
        setFirebaseLoading(false);
      }
    }
  }, [loading, authUser]);

  return [firebaseUser, firebaseLoading];
};

export default useFirebaseUser;
