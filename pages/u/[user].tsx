import { doc, getDoc, getFirestore } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Backdrop, Modal } from "../../components/Menus";
import { user } from "../../types";
import { firebaseApp } from "../../utils/firebase";

interface UserPageProps {
  userData: user;
}

const UserPage: React.FC<UserPageProps> = ({ userData }) => {
  const router = useRouter();

  return (
    <div>
      <AnimatePresence>
        {process.env.NODE_ENV === "development" ? (
          <Backdrop onClick={() => router.back()}>
            <Modal>
              <div className="p-8 grid gap-4">
                <h1 className="text-xl text-zinc-200/90 font-bold uppercase">
                  Under construction!
                </h1>
                <p className="text-zinc-200/70">
                  This section is still under construction
                </p>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 pt-2 text-zinc-200">
                  <button
                    onClick={() => router.push("/")}
                    className="bg-zinc-700 hover:bg-zinc-600 active:scale-90 transform transition-all py-2 uppercase font-bold text- rounded-md"
                  >
                    Go back home
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="bg-red-600 text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          </Backdrop>
        ) : (
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        )}
      </AnimatePresence>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (
  c
) => {
  let user: string | null = null;
  // Handle params edge cases
  if (c.params?.user) {
    if (typeof c.params.user === "string") {
      user = c.params.user;
    } else {
      user = c.params.user[0];
    }
  }
  const db = getFirestore(firebaseApp);
  const docRef = doc(db, "users", user || "");
  const docRes = await getDoc(docRef);

  if (docRes.exists()) {
    const userData = docRes.data() as user;
    return {
      props: {
        userData,
      },
    };
  }

  return { notFound: true };
};

export default UserPage;
