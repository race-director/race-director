import { doc, getFirestore } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { CommentPostButton, LikePostButton, SharePostButton } from ".";
import { post } from "../../types";
import { firebaseApp } from "../../utils/firebase";

interface PostCardProps {
  post: post;
  href: string;
  isLast: boolean;
  loadMore?: () => void;
  priority?: boolean;
  showAuthor?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  showAuthor,
  priority,
  post,
  href,
  isLast,
  loadMore,
}) => {
  const db = getFirestore(firebaseApp);
  const [timesIntersected, setTimesIntersected] = useState<number>(0);
  const [authorData, authorDataLoading] = useDocumentDataOnce(
    showAuthor ? doc(db, "users", post.metadata.author) : null
  );

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

  return (
    <div className="overflow-hidden rounded-md shadow-lg" id={post.id}>
      <Link href={`/p/${post.id}`}>
        <a>
          <div className="relative aspect-video bg-black">
            <Image
              priority={priority}
              src={post.coverImage.coverImageUrl}
              alt={post.coverImage.coverImageCaption}
              layout="fill"
              objectFit="contain"
            ></Image>
          </div>
        </a>
      </Link>
      <div className="bg-zinc-800 px-4 py-4">
        <div className="flex flex-col space-y-2">
          <div>
            <h2 className="text-xl font-bold uppercase text-zinc-200/90">
              {post.metadata.headline}
            </h2>
            <p className="text-zinc-200/70">{post.metadata.summary}</p>
          </div>
          {showAuthor && (
            <div className="flex items-center space-x-2">
              <p className="font-semibold uppercase text-zinc-200/90">
                {authorDataLoading
                  ? "Loading..."
                  : `By ${authorData?.displayName}`}
              </p>
            </div>
          )}
        </div>
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
