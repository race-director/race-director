import { doc, getFirestore, increment, updateDoc } from "firebase/firestore";
import React from "react";
import { post } from "../../types";
import { firebaseApp } from "../../utils/firebase";

interface SharePostProps {
  post: post;
}

const SharePost: React.FC<SharePostProps> = ({ post }) => {
  const db = getFirestore(firebaseApp);

  const handleShare = () => {
    const postRef = doc(db, `posts/${post?.id}`);
    if ("share" in navigator) {
      navigator
        .share({ url: location.href })
        .then(() => {
          updateDoc(postRef, {
            "metadata.shareCount": increment(1),
          });
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center space-x-2 px-4 py-2 border-zinc-200/70 rounded-md bg-zinc-900 hover:bg-zinc-800 transform transition-all active:scale-95 border-2 text-lg md:text-2xl font-semibold text-zinc-200/90"
    >
      <div>
        <svg
          className="fill-current text-blue-500/80 h-5 w-5 md:h-6 md:w-6"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
        </svg>
      </div>
      <span>{post.metadata.shareCount}</span>
    </button>
  );
};

export default SharePost;
