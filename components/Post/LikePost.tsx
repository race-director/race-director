import {
  deleteDoc,
  doc,
  getFirestore,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { Auth } from "../../pages/_app";
import { post, postLike } from "../../types";
import { firebaseApp } from "../../utils/firebase";

interface LikePostProps {
  post: post;
}

const LikePost: React.FC<LikePostProps> = ({ post }) => {
  const db = getFirestore(firebaseApp);
  const [isLiked, setIsLiked] = useState(false);
  const [user] = useContext(Auth);
  const [likeData, likeLoading] = useDocument(
    doc(db, `posts/${post?.id}/likes/${user?.uid}`)
  );

  const handleLike = async () => {
    if (user) {
      const likeRef = doc(db, `posts/${post?.id}/likes/${user.uid}`);
      const postRef = doc(db, `posts/${post?.id}`);

      if (isLiked) {
        deleteDoc(likeRef);
        // Update like count
        updateDoc(postRef, {
          "metadata.likeCount": increment(-1),
        });
      } else {
        const like: postLike = {
          userId: user?.uid || "",
          postId: post?.id || "",
          createdAt: new Date().getTime(),
        };

        // Update like count
        updateDoc(postRef, {
          "metadata.likeCount": increment(1),
        });
        setDoc(likeRef, like);
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

  return (
    <button
      onClick={handleLike}
      className="flex items-center justify-center space-x-2 px-4 py-2 border-zinc-200/70 rounded-md bg-zinc-900 hover:bg-zinc-800 transform transition-all active:scale-95 border-2 text-lg md:text-2xl font-semibold text-zinc-200/90"
    >
      <div>
        {isLiked ? (
          <svg
            className="fill-current text-red-600 h-5 w-5 md:h-6 md:w-6"
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
            className="fill-current text-red-600 h-5 w-5 md:h-6 md:w-6"
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
      </div>
      <span>{post.metadata.likeCount}</span>
    </button>
  );
};

export default LikePost;
