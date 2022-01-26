import { doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSideProps } from "next";
import React from "react";
import { user } from "../../types";
import { firebaseApp } from "../../utils/firebase";

interface UserPageProps {
  userData: user;
}

const UserPage: React.FC<UserPageProps> = ({ userData }) => {
  return (
    <div>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
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
