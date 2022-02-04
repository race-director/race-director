import { formatDistance, subDays } from "date-fns";
import {
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getFirestore,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Anchorme } from "react-anchorme";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { Auth } from "../../pages/_app";
import { comment, commentLike, post, user } from "../../types";
import { firebaseApp } from "../../utils/firebase";
import { ratePost } from "../../utils/other";

interface CommentProps {
  comment: comment;
  post: post;
}

const Comment: React.FC<CommentProps> = ({ comment, post }) => {
  const db = getFirestore(firebaseApp);
  const [loggedInUser] = useContext(Auth);
  const [authorDoc, authorLoading] = useDocumentDataOnce(
    doc(db, `users/${comment.userId}`) as DocumentReference<user>
  );
  const [localLikes, setLocalLikes] = useState<number>(comment.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleLike = async () => {
    const likeDoc = doc(
      db,
      `posts/${comment.postId}/comments/${comment.commentId}/likes/${loggedInUser?.uid}`
    );
    const commentDoc = doc(
      db,
      `posts/${comment.postId}/comments/${comment.commentId}`
    );
    if (loggedInUser) {
      if (!isLiked) {
        setLocalLikes(localLikes + 1);
        setIsLiked(true);

        const like: commentLike = {
          userId: loggedInUser?.uid || "",
          commentId: comment.commentId,
          createdAt: new Date().getTime(),
        };

        updateDoc(commentDoc, {
          likes: increment(1),
        });
        setDoc(likeDoc, like);
      } else {
        setLocalLikes(localLikes - 1);
        setIsLiked(false);
        deleteDoc(likeDoc);
        updateDoc(commentDoc, {
          likes: increment(-1),
        });
      }
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      const likeDoc = doc(
        db,
        `posts/${comment.postId}/comments/${comment.commentId}/likes/${loggedInUser?.uid}`
      );
      getDoc(likeDoc).then((doc) => {
        if (doc.exists()) {
          setIsLiked(true);
        }
      });
    }
  }, [loggedInUser]);

  const handleDeleteComment = async () => {
    if (loggedInUser) {
      const commentDoc = doc(
        db,
        `posts/${comment.postId}/comments/${comment.commentId}`
      );
      const postDoc = doc(db, `posts/${comment.postId}`);
      updateDoc(postDoc, {
        "metadata.commentCount": increment(-1),
        score: ratePost({
          ...post,
          metadata: {
            ...post.metadata,
            commentCount: post.metadata.commentCount - 1,
          },
        }),
      });
      deleteDoc(commentDoc);
      setIsDeleted(true);
    }
  };

  return (
    <>
      {!isDeleted ? (
        <>
          {!authorLoading && (
            <div className="grid gap-2 border border-x-0 border-t-0 border-zinc-600/60 py-4">
              <div className="flex w-full justify-between">
                <Link href={`/u/${authorDoc?.uid || ""}`}>
                  <a className="flex items-center space-x-3 font-semibold">
                    <Image
                      alt={authorDoc?.displayName || ""}
                      src={authorDoc?.photoURL || ""}
                      height={32}
                      width={32}
                      className="rounded-full object-cover"
                    ></Image>
                    <p className="text-sm">{authorDoc?.displayName}</p>
                  </a>
                </Link>
                <div className="flex items-center justify-center space-x-4">
                  {comment.userId === loggedInUser?.uid && (
                    <button
                      className="relative"
                      onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}
                    >
                      <svg
                        className="h-5 w-5 fill-current text-zinc-200/80"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#000000"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                      <AnimatePresence>
                        {moreOptionsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "4rem" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute right-0 top-8 grid w-44 items-center justify-center rounded-md bg-zinc-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              onClick={handleDeleteComment}
                              className="w-44 rounded-md py-4 font-semibold uppercase transition-colors hover:bg-zinc-700"
                            >
                              Delete comment
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  )}
                  <button
                    className="flex items-center space-x-1"
                    onClick={handleLike}
                  >
                    {isLiked ? (
                      <svg
                        className="h-5 w-5 fill-current text-red-600"
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
                        className="h-5 w-5 fill-current text-red-600"
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
                    <p>{localLikes}</p>
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm">
                  <Anchorme
                    className="text-blue-400 underline transition-colors hover:text-blue-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {comment.content}
                  </Anchorme>
                </p>
              </div>
              <div>
                <p className="pt-2 text-xs uppercase text-zinc-200/70">
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
      ) : (
        <></>
      )}
    </>
  );
};

export default Comment;
