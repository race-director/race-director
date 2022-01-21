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
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { Comment } from "../../components/Comments";
import { Navigation } from "../../components/Navigation";
import { FALLBACK_PHOTO_URL } from "../../components/Navigation/Auth/Auth";
import { comment, post, user } from "../../types";
import { firebaseApp } from "../../utils/firebase";
import {
  generateAlphanumericStr,
  loadMoreComments,
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

  // Update view count
  useEffect(() => {
    if (post) {
      updateDoc(doc(db, `posts`, post.id), {
        "metadata.viewCount": increment(1),
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
        nestedComments: [],
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
          <div className="w-full flex flex-col items-center dark:bg-zinc-900 min-h-screen">
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

                <div className="grid gap-2">
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
