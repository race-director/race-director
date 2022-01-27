import { doc, getFirestore, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CommentPostButton, LikePostButton, SharePostButton } from ".";
import { post } from "../../types";
import { firebaseApp } from "../../utils/firebase";
import { ratePost } from "../../utils/other";

interface PostCardProps {
  post: post;
  href: string;
  isLast: boolean;
  loadMore?: () => void;
  priority?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  priority,
  post,
  href,
  isLast,
  loadMore,
}) => {
  const db = getFirestore(firebaseApp);
  const [timesIntersected, setTimesIntersected] = useState<number>(0);

  useEffect(() => {
    if (loadMore) {
      const observer = new IntersectionObserver(
        () => setTimesIntersected((t) => t + 1),
        { threshold: 0.25 }
      );
      if (isLast) {
        let target = document.getElementById(post.id);
        observer.observe(target as Element);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (timesIntersected === 2 && loadMore) {
      loadMore();
    }
  }, [timesIntersected]);

  useEffect(() => {
    if (post) {
      updateDoc(doc(db, `posts`, post.id), {
        score: ratePost(post),
      });
    }
  }, [post]);

  return (
    <div className="shadow-lg overflow-hidden rounded-md" id={post.id}>
      <Link href={`/p/${post.id}`}>
        <a>
          <div className="aspect-video object-cover relative">
            <Image
              priority={priority}
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
