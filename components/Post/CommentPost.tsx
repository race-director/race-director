import Link from "next/link";
import React from "react";
import { post } from "../../types";

interface CommenPostProps {
  post: post;
  href: string;
}

const CommenPost: React.FC<CommenPostProps> = ({ post, href }) => {
  return (
    <Link href={href}>
      <a className="flex transform items-center justify-center space-x-2 rounded-md border-2 border-zinc-200/70 bg-zinc-900 px-4 py-2 text-lg font-semibold text-zinc-200/90 transition-all hover:bg-zinc-800 active:scale-95 md:text-2xl">
        <svg
          className="h-5 w-5 fill-current text-blue-500/80 md:h-6 md:w-6"
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
  );
};

export default CommenPost;
