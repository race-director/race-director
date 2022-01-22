import {
  deleteDoc,
  doc,
  getFirestore,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { Auth } from "../../pages/_app";
import { post, postLike } from "../../types";
import { firebaseApp } from "../../utils/firebase";

interface PostCardProps {
  post: post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [user] = useContext(Auth);
  const db = getFirestore(firebaseApp);
  const [likeData, likeLoading] = useDocument(
    doc(db, `posts/${post?.id}/likes/${user?.uid}`)
  );

  const handleShare = () => {
    if ("share" in navigator) {
      navigator
        .share({ url: `${location.href}p/${post.id}` })
        .then(() => {
          updateDoc(doc(db, `posts/${post?.id}`), {
            "metadata.shareCount": increment(1),
          });
        })
        .catch((err) => console.error(err));
    }
  };

  const handleLike = async () => {
    if (user) {
      if (isLiked) {
        deleteDoc(doc(db, `posts/${post?.id}/likes/${user.uid}`));

        // Update like count
        updateDoc(doc(db, `posts/${post?.id}`), {
          "metadata.likeCount": increment(-1),
        });
      } else {
        const like: postLike = {
          userId: user?.uid || "",
          postId: post?.id || "",
          createdAt: new Date().getTime(),
        };

        // Update like count
        updateDoc(doc(db, `posts/${post?.id}`), {
          "metadata.likeCount": increment(1),
        });

        setDoc(doc(db, `posts/${post?.id}/likes/${user.uid}`), like);
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
    <div className="shadow-lg overflow-hidden rounded-md">
      <Link href={`/p/${post.id}`}>
        <a>
          <div className="aspect-video object-cover relative">
            <Image
              src={post.coverImage.coverImageUrl}
              alt={post.coverImage.coverImageCaption}
              layout="fill"
              objectFit="cover"
            ></Image>
          </div>
        </a>
      </Link>
      <div className="bg-zinc-800 px-4 py-4">
        <h2 className="text-xl font-bold uppercase text-zinc-200/90">
          {post.metadata.headline}
        </h2>
        <p className="text-zinc-200/70">{post.metadata.summary}</p>
        <div className="grid grid-cols-3 justify-between gap-2 pt-4">
          <button
            onClick={handleLike}
            className="flex items-center justify-center space-x-2 px-4 py-2 border-zinc-200/70 rounded-md bg-zinc-800 hover:bg-zinc-700 transform transition-all active:scale-95 border-2 text-xl font-semibold text-zinc-200/90"
          >
            <div>
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
            </div>
            <span>{post.metadata.likeCount}</span>
          </button>
          <Link href={`/p/${post.id}#comments`}>
            <a className="flex items-center justify-center space-x-2 px-4 py-2 border-zinc-200/70 rounded-md bg-zinc-800 hover:bg-zinc-700 transform transition-all active:scale-95 border-2 text-xl font-semibold text-zinc-200/90">
              <svg
                className="fill-current text-blue-500/80 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
              <span>{post.metadata.commentCount}</span>
            </a>
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 px-4 py-2 border-zinc-200/70 rounded-md bg-zinc-800 hover:bg-zinc-700 transform transition-all active:scale-95 border-2 text-xl font-semibold text-zinc-200/90"
          >
            <div>
              <svg
                className="fill-current text-blue-500/80 h-5 w-5"
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
        </div>
      </div>
    </div>
  );
};

export default PostCard;
