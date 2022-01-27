import { formatDistance, subDays } from "date-fns";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import Markdown from "markdown-to-jsx";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Navigation } from "../../components/Navigation";
import { FALLBACK_PHOTO_URL } from "../../components/Navigation/Auth/Auth";
import {
  CommentPostButton,
  HeadMetadata,
  LikePostButton,
  SharePostButton,
} from "../../components/Post";
import CommentSection from "../../components/Post/CommentSection";
import { comment, post, user } from "../../types";
import { firebaseApp } from "../../utils/firebase";
import { ratePost } from "../../utils/other";

interface PostPageProps {
  post: post | null;
  markdown: string | null;
  author: user;
  comments: comment[];
  host: string;
}

const PostPage: React.FC<PostPageProps> = ({
  comments: initialComments,
  post: initialPost,
  markdown,
  author,
  host,
}) => {
  const db = getFirestore(firebaseApp);
  const [post, setPost] = useState<post | null>(initialPost);
  const [postData, postLoading, postErr] = useDocumentData(
    doc(db, `posts/${post?.id}`)
  );

  useEffect(() => {
    if (postErr) {
      console.error(postErr);
    }
  }, [postErr]);

  // Update view count
  useEffect(() => {
    if (post) {
      updateDoc(doc(db, `posts`, post.id), {
        "metadata.viewCount": increment(1),
      });
    }
  }, []);

  // Update post score every time data changes
  useEffect(() => {
    if (post) {
      updateDoc(doc(db, `posts`, post.id), {
        score: ratePost(post),
      });
    }
  }, [post]);

  // Use the snapshot listener and set the post state
  useEffect(() => {
    if (!postLoading && postData) {
      setPost(postData as unknown as post);
    }
  }, [postData, postLoading]);

  return (
    <>
      {post ? (
        <div>
          <HeadMetadata href={`${host}p/${post.id}`} post={post}></HeadMetadata>
          <div className="w-full flex flex-col items-center dark:bg-zinc-900 min-h-screen pb-12">
            <Navigation></Navigation>
            <div className="relative w-full max-w-4xl z-0 aspect-video">
              <Image
                layout="fill"
                className="object-cover"
                src={post.coverImage.coverImageUrl}
                alt={post.coverImage.coverImageCaption}
              ></Image>
              <figcaption className="absolute top-full right-0 -translate-y-10 bg-zinc-200/80 dark:bg-black/60 px-4 py-2 rounded-tl-md dark:text-zinc-200 text-zinc-900 italic">
                - {post.coverImage.coverImageCaption}
              </figcaption>
            </div>
            <div className="px-4 prose prose-sm md:prose-base prose-zinc max-w-3xl w-screen dark:prose-invert font-sans md:prose-h1:text-5xl prose-h1:text-4xl prose-h2:text-2xl md:prose-h2:text-3xl py-8 md:py-12">
              <div>
                <h1>{post.metadata.headline}</h1>
                <p className="italic font-semibold text-lg">
                  {post.metadata.summary}
                </p>
              </div>
              {author && (
                <div className="not-prose flex">
                  <Link href={`/u/${author.uid}`}>
                    <a>
                      <div className="flex space-x-4 not-prose items-center">
                        <Image
                          alt="Author Profile"
                          className="rounded-full object-cover"
                          width={64}
                          height={64}
                          src={author.photoURL || FALLBACK_PHOTO_URL}
                        ></Image>
                        <div>
                          <p className="font-bold">{author.displayName}</p>
                          <div className="text-base flex space-x-2 items-center">
                            <p>
                              {formatDistance(
                                subDays(new Date(post.metadata.createdAt), 0),
                                new Date(),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                            <div className="flex space-x-2 items-center">
                              <span>·</span>
                              <div className="flex items-center space-x-1">
                                <p>{post.metadata.viewCount}</p>{" "}
                                <svg
                                  className="fill-current text-zinc-200 h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 0 24 24"
                                  width="24px"
                                  fill="#000000"
                                >
                                  <path d="M0 0h24v24H0V0z" fill="none" />
                                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              )}
              {markdown && <Markdown>{markdown}</Markdown>}
              <hr />
              <CommentSection
                initialComments={initialComments}
                post={post}
              ></CommentSection>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="fixed bottom-2 right-0 left-0 grid items-center justify-center z-20 bg-zinc-900">
            <div className="max-w-3xl w-screen grid grid-cols-3 justify-between px-4 gap-2">
              <LikePostButton post={post}></LikePostButton>
              <CommentPostButton
                href="#comments"
                post={post}
              ></CommentPostButton>
              <SharePostButton
                href={`${host}p/${post.id}`}
                post={post}
              ></SharePostButton>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>We encountered an issue while loading this post</h1>
        </div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (
  c
) => {
  let post: string | null = null;
  // Handle params edge cases
  if (c.params?.post) {
    if (typeof c.params.post === "string") {
      post = c.params.post;
    } else {
      post = c.params.post[0];
    }
  }

  const db = getFirestore(firebaseApp);
  const docRef = doc(db, "posts", post || "");
  const docRes = await getDoc(docRef);
  if (docRes.exists()) {
    const docData = docRes.data() as post;
    const markdown = await (await fetch(docData.markdownUrl)).text();
    const resAuthor = await getDoc(doc(db, "users", docData.metadata.author));
    const commentQ = query(
      collection(db, `posts/${post}/comments`),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    const commentsSnapshot = await getDocs(commentQ);
    let comments: comment[] = [];
    commentsSnapshot.forEach((doc) => {
      comments.push(doc.data() as comment);
    });

    return {
      props: {
        post: docData,
        markdown: markdown,
        author: resAuthor.data() as user,
        comments: comments,
        host: `${process.env.HOST}`,
      },
    };
  } else {
    return { notFound: true };
  }
};

export default PostPage;
