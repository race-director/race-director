import { doc, getFirestore, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { CommentPostButton, LikePostButton, SharePostButton } from ".";
import { post } from "../../types";
import { firebaseApp } from "../../utils/firebase";
import { ratePost } from "../../utils/other";

interface PostCardProps {
  post: post;
  href: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, href }) => {
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    if (post) {
      updateDoc(doc(db, `posts`, post.id), {
        score: ratePost(post),
      });
    }
  }, [post]);

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
          <SharePostButton href={href} post={post}></SharePostButton>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
