import { formatDistance, subDays } from "date-fns";
import {
  deleteDoc,
  doc,
  getFirestore,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { useDocument, useDocumentOnce } from "react-firebase-hooks/firestore";
import { Auth } from "../../pages/_app";
import { comment, commentLike, user } from "../../types";
import { firebaseApp } from "../../utils/firebase";

interface CommentProps {
  comment: comment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const db = getFirestore(firebaseApp);
  const [loggedInUser] = useContext(Auth);
  // Is not necessary to set up an event listener, so we use useDocumentOnce
  const [authorSnap, authorLoading] = useDocumentOnce(
    doc(db, `users/${comment.userId}`)
  );
  // It is necessary to set up an event listener, so we use useDocumentData
  const [likeData, likeLoading] = useDocument(
    doc(
      db,
      `posts/${comment.postId}/comments/${comment.commentId}/likes/${loggedInUser?.uid}`
    )
  );
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (loggedInUser) {
      if (isLiked) {
        deleteDoc(
          doc(
            db,
            `posts/${comment.postId}/comments/${comment.commentId}/likes/${loggedInUser?.uid}`
          )
        );

        // Update like count
        updateDoc(
          doc(db, `posts/${comment.postId}/comments/${comment.commentId}`),
          { likes: increment(-1) }
        );
      } else {
        const like: commentLike = {
          userId: loggedInUser?.uid || "",
          commentId: comment.commentId,
          createdAt: new Date().getTime(),
        };

        // Update like count
        updateDoc(
          doc(db, `posts/${comment.postId}/comments/${comment.commentId}`),
          { likes: increment(1) }
        );

        setDoc(
          doc(
            db,
            `posts/${comment.postId}/comments/${comment.commentId}/likes/${loggedInUser?.uid}`
          ),
          like
        );
      }
    }
  };

  useEffect(() => {
    if (!likeLoading && likeData?.exists()) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [likeData, likeLoading]);

  const { displayName, photoURL } = (authorSnap?.data() as user) || {};

  return (
    <>
      {!authorLoading && (
        <div className="border grid gap-2 border-x-0 border-t-0 border-zinc-600/60 py-4">
          <div className="flex w-full justify-between">
            <div className="flex space-x-3 items-center font-semibold">
              <Image
                src={photoURL || ""}
                height={32}
                width={32}
                className="rounded-full"
              ></Image>
              <p className="text-sm">{displayName}</p>
            </div>
            <button
              className="flex space-x-1 items-center"
              onClick={handleLike}
            >
              {isLiked ? (
                <svg
                  className="fill-current text-red-600 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg
                  className="fill-current text-red-600 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
                </svg>
              )}
              <p>{comment.likes}</p>
            </button>
          </div>
          <div>
            <p className="text-sm">{comment.content}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-200/70 uppercase pt-2">
              {formatDistance(
                subDays(new Date(comment.createdAt), 0),
                new Date(),
                {
                  addSuffix: true,
                }
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
