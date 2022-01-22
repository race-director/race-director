import { formatDistance, subDays } from "date-fns";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Markdown from "markdown-to-jsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import {
  useCollectionData,
  useDocument,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { Comment } from "../../components/Comments";
import { Navigation } from "../../components/Navigation";
import { FALLBACK_PHOTO_URL } from "../../components/Navigation/Auth/Auth";
import { comment, post, postLike, user } from "../../types";
import { firebaseApp } from "../../utils/firebase";
import {
  generateAlphanumericStr,
  loadMoreComments,
  ratePost,
  toTitleCase,
} from "../../utils/other";
import { Auth } from "../_app";

interface PostPageProps {
  post: post | null;
  markdown: string | null;
  author: user;
  comments: comment[];
  href: string;
}

const PostPage: React.FC<PostPageProps> = ({
  comments: initialComments,
  post: initialPost,
  markdown,
  author,
  href,
}) => {
  const db = getFirestore(firebaseApp);
  const [isLiked, setIsLiked] = useState(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [post, setPost] = useState<post | null>(initialPost);
  const [comments, setComments] = useState<comment[]>(initialComments);
  const [user] = useContext(Auth);
  const [commentAmount, setCommentAmount] = useState(3);
  const [commentsSnapshot, commentsLoading] = useCollectionData(
    query(
      collection(db, `posts/${post?.id}/comments`),
      orderBy("createdAt", "desc"),
      limit(commentAmount)
    ),
    { idField: "id" }
  );
  const [postData, postLoading] = useDocumentData(doc(db, `posts/${post?.id}`));
  // It is necessary to set up an event listener, so we use useDocumentData
  const [likeData, likeLoading] = useDocument(
    doc(db, `posts/${post?.id}/likes/${user?.uid}`)
  );

  const handleShare = () => {
    if ("share" in navigator) {
      navigator
        .share({ url: location.href })
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

  // Update view count
  useEffect(() => {
    if (post) {
      updateDoc(doc(db, `posts`, post.id), {
        "metadata.viewCount": increment(1),
        score: ratePost(post),
      });
    }
  }, []);

  // Set up the snapshot listener for the post on the client
  useEffect(() => {
    if (!postLoading) {
      setPost(postData as unknown as post);
    }
  }, [postData, postLoading]);

  // Set up the snapshot listener for the comments on the client
  useEffect(() => {
    if (!commentsLoading) {
      setComments(commentsSnapshot?.map((c) => c as unknown as comment) || []);
    }
  }, [commentsLoading, commentsSnapshot]);

  const submitComment = async () => {
    if (post && user) {
      const commentId = generateAlphanumericStr(20);
      const newComment: comment = {
        content: commentContent,
        createdAt: new Date().getTime(),
        postId: post.id,
        userId: user.uid,
        likes: 0,
        commentId,
      };

      setCommentContent("");

      // Create new comment document in comments subcollection
      const db = getFirestore(firebaseApp);
      await setDoc(doc(db, `posts/${post.id}/comments`, commentId), newComment);

      // Update post's comment count
      await updateDoc(doc(db, `posts`, post.id), {
        "metadata.commentCount": increment(1),
      });
    }
  };

  return (
    <>
      {post && (
        <div>
          <Head>
            <meta name="title" content={toTitleCase(post.metadata.headline)} />
            <meta name="description" content={post.metadata.summary} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={href} />
            <meta
              property="og:title"
              content={toTitleCase(post.metadata.headline)}
            />
            <meta property="og:description" content={post.metadata.summary} />
            <meta property="og:image" content={post.coverImage.coverImageUrl} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={href} />
            <meta
              property="twitter:title"
              content={toTitleCase(post.metadata.headline)}
            />
            <meta
              property="twitter:description"
              content={post.metadata.summary}
            />
            <meta
              property="twitter:image"
              content={post.coverImage.coverImageUrl}
            />
            <title>{toTitleCase(post.metadata.headline)}</title>
          </Head>
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
                <p>{post.metadata.summary}</p>
              </div>
              {author && (
                <div className="not-prose flex">
                  <Link href={`/u/${author.uid}`}>
                    <a>
                      <div className="flex space-x-4 not-prose items-center">
                        <Image
                          alt="Author Profile"
                          className="rounded-full"
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
              <div className="not-prose grid gap-8">
                <div className="grid gap-4">
                  <h2 className="text-xl md:text-2xl font-bold">Join in</h2>
                  <div className="flex">
                    <input
                      disabled={!user}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && commentContent) {
                          submitComment();
                        }
                      }}
                      placeholder={
                        user ? "Add a comment..." : "Login to comment"
                      }
                      className="w-full px-2 py-2 disabled:opacity-60 disabled:cursor-not-allowed bg-transparent border dark:border-zinc-200/60 border-zinc-400/60 rounded-md flex-1 mr-2"
                    ></input>
                    <button
                      onClick={submitComment}
                      disabled={!commentContent || !user}
                      className={`px-4 font-semibold dark:bg-cyan-600 bg-cyan-500 hover:bg-cyan-600 text-zinc-100 dark:hover:bg-cyan-700 rounded-md transform transition-all active:scale-95 disabled:opacity-60 disabled:hover:bg-cyan-500 dark:disabled:hover:bg-cyan-600 disabled:cursor-not-allowed`}
                    >
                      Send
                    </button>
                  </div>
                </div>

                <div className="grid gap-2" id="comments">
                  <h2 className="text-xl md:text-2xl font-bold">
                    Comments ({post.metadata.commentCount})
                  </h2>
                  <div className="grid">
                    {comments.map((c, idx) => (
                      <Comment comment={c} key={idx}></Comment>
                    ))}
                  </div>
                  {comments.length === 0 && (
                    <div>
                      <p className="text-lg text-zinc-200/70">
                        This is very quiet. Send a comment to start the
                        conversation!
                      </p>
                    </div>
                  )}
                  {!(comments.length === post.metadata.commentCount) && (
                    <button
                      className="py-2 px-4 border-zinc-200/70 border-2 rounded-md font-semibold transform active:scale-95 transition-all"
                      onClick={() =>
                        setCommentAmount(
                          commentAmount +
                            loadMoreComments(post, comments.length)
                        )
                      }
                    >
                      Load more comments
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="fixed bottom-2 right-0 left-0 grid items-center justify-center z-20 bg-zinc-900">
            <div className="max-w-3xl w-screen grid grid-cols-3 justify-between px-4 gap-2">
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
              <Link href="#comments">
                <a className="flex items-center justify-center space-x-2 px-4 py-2 border-zinc-200/70 rounded-md bg-zinc-900 hover:bg-zinc-800 transform transition-all active:scale-95 border-2 text-lg md:text-2xl font-semibold text-zinc-200/90">
                  <svg
                    className="fill-current text-blue-500/80 h-5 w-5 md:h-6 md:w-6"
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
            </div>
          </div>
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
        href: `https://racedirector.vercel.app${c.resolvedUrl}`,
      },
    };
  } else {
    return { notFound: true };
  }
};

export default PostPage;
