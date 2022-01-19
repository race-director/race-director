import { doc, getFirestore } from "firebase/firestore";
import Image from "next/image";
import React from "react";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { comment, user } from "../../types";
import { firebaseApp } from "../../utils/firebase";

interface CommentProps {
  comment: comment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const db = getFirestore(firebaseApp);
  const [userSnapshot, loading] = useDocumentOnce(
    doc(db, `users/${comment.userId}`)
  );
  const { displayName, photoURL } = (userSnapshot?.data() as user) || {};

  return (
    <>
      {!loading && (
        <div className="flex space-x-4 items-center border border-x-0 border-t-0 border-zinc-600/60 py-5">
          <div>
            <Image
              src={photoURL || ""}
              height={56}
              width={56}
              className="rounded-full h-14 w-14"
            ></Image>
          </div>
          <div>
            <p className="font-semibold">{displayName}</p>
            <p>{comment.content}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
