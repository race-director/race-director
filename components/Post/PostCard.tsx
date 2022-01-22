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
import { CommentPostButton, LikePostButton, SharePostButton } from ".";
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
          <LikePostButton post={post}></LikePostButton>
          <CommentPostButton
            post={post}
            href={`/p/${post.id}#comments`}
          ></CommentPostButton>
          <SharePostButton post={post}></SharePostButton>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
