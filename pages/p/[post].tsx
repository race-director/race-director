import { formatDistance, subDays } from "date-fns";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { AnimatePresence } from "framer-motion";
import Markdown from "markdown-to-jsx";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Backdrop, Modal } from "../../components/Menus";
import { Navigation } from "../../components/Navigation";
import { FALLBACK_PHOTO_URL } from "../../components/Navigation/Auth/Auth";
import {
  CommentPostButton,
  HeadMetadata,
  LikePostButton,
  SharePostButton,
} from "../../components/Post";
import CommentSection from "../../components/Post/CommentSection";
import { post, user } from "../../types";
import { firebaseApp } from "../../utils/firebase";
import { ratePost } from "../../utils/other";
import { Auth } from "../_app";

interface PostPageProps {
  post: post | null;
  markdown: string | null;
  author: user;
  host: string;
}

const PostPage: React.FC<PostPageProps> = ({
  post,
  markdown,
  author,
  host,
}) => {
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  const [user] = useContext(Auth);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (post) {
      updateDoc(doc(db, `posts`, post.id), {
        "metadata.viewCount": increment(1),
        score: ratePost({
          ...post,
          metadata: {
            ...post.metadata,
            viewCount: post.metadata.viewCount + 1,
          },
        }),
      });
    }
  }, []);

  const handleDelete = async () => {
    try {
      deleteDoc(doc(db, `posts`, post?.id || ""));
      deleteDoc(doc(db, `users/${user?.uid}/posts/${post?.id}`));
      const fileRef = ref(storage, `posts/${post?.id}.md`);
      deleteObject(fileRef);
      router.push("/");
    } catch (err) {
      setConfirmDelete(false);
      setError(err as Error);
    }
  };

  return (
    <>
      {post ? (
        <div>
          <HeadMetadata href={`${host}p/${post.id}`} post={post}></HeadMetadata>
          <div className="flex min-h-screen w-full flex-col items-center pb-12 dark:bg-zinc-900">
            <Navigation></Navigation>
            <div className="relative z-0 aspect-video w-full max-w-4xl bg-black">
              <Image
                layout="fill"
                objectFit="contain"
                src={post.coverImage.coverImageUrl}
                alt={post.coverImage.coverImageCaption}
              ></Image>
              <figcaption className="absolute top-full right-0 -translate-y-10 rounded-tl-md bg-zinc-200/80 px-4 py-2 italic text-zinc-900 dark:bg-black/60 dark:text-zinc-200">
                - {post.coverImage.coverImageCaption}
              </figcaption>
            </div>
            <div className="prose prose-sm prose-zinc w-screen max-w-3xl px-4 py-8 font-sans prose-h1:text-4xl prose-h2:text-2xl dark:prose-invert md:prose-base md:py-12 md:prose-h1:text-5xl md:prose-h2:text-3xl">
              <div>
                <h1>{post.metadata.headline}</h1>
                <p className="text-lg font-semibold italic">
                  {post.metadata.summary}
                </p>
              </div>
              {author && (
                <div className="not-prose flex">
                  <Link href={`/u/${author.uid}`}>
                    <a>
                      <div className="not-prose flex items-center space-x-4">
                        <Image
                          alt="Author Profile"
                          className="rounded-full object-cover"
                          width={64}
                          height={64}
                          src={author.photoURL || FALLBACK_PHOTO_URL}
                        ></Image>
                        <div>
                          <p className="font-bold">{author.displayName}</p>
                          <div className="flex items-center space-x-2 text-base">
                            <p>
                              {formatDistance(
                                subDays(new Date(post.metadata.createdAt), 0),
                                new Date(),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span>·</span>
                              <div className="flex items-center space-x-1">
                                <p>{post.metadata.viewCount}</p>{" "}
                                <svg
                                  className="h-4 w-4 fill-current text-zinc-200"
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
              {user && author?.uid === user?.uid && (
                <>
                  <div className="not-prose grid gap-4">
                    <h4 className="text-lg font-semibold">
                      Only you can see these options
                    </h4>
                    <div>
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="disabled:hover-bg-red-600 col-span-3 transform rounded-md bg-red-600 px-4 py-2 text-center font-bold uppercase text-zinc-200 transition-all hover:bg-red-700 active:scale-90 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Delete post
                      </button>
                    </div>
                  </div>
                  <hr />
                </>
              )}
              <CommentSection post={post}></CommentSection>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="fixed bottom-2 right-0 left-0 z-20 grid items-center justify-center bg-zinc-900">
            <div className="grid w-screen max-w-3xl grid-cols-3 justify-between gap-2 px-4">
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
      <AnimatePresence>
        {confirmDelete && (
          <Backdrop onClick={() => setConfirmDelete(false)}>
            <Modal>
              <div className="grid gap-4 p-8">
                <h1 className="text-xl font-bold uppercase text-zinc-200/90">
                  Are you sure you want to delete this post?
                </h1>
                <p className="text-zinc-200/70">
                  This is a permanent action and cannot be undone.
                </p>
                <div className="grid grid-cols-1 gap-2 pt-2 text-zinc-200 sm:grid-cols-2">
                  <button
                    onClick={handleDelete}
                    className="text- transform rounded-md bg-zinc-700 py-2 font-bold uppercase transition-all hover:bg-zinc-600 active:scale-90"
                  >
                    Okay
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="transform rounded-md bg-red-600 py-2 text-center font-bold uppercase transition-all hover:bg-red-700 active:scale-90"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <Backdrop onClick={() => setError(null)}>
            <Modal>
              <div className="grid gap-4 p-8">
                <h1 className="text-xl font-bold uppercase text-zinc-200/90">
                  We&apos;ve encountered an issue
                </h1>
                <p className="text-zinc-200/70">{error.message}</p>
                <div className="grid grid-cols-1 gap-2 pt-2 text-zinc-200 sm:grid-cols-2">
                  <button
                    onClick={() => setError(null)}
                    className="text- transform rounded-md bg-zinc-700 py-2 font-bold uppercase transition-all hover:bg-zinc-600 active:scale-90"
                  >
                    Okay
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="transform rounded-md bg-red-600 py-2 text-center font-bold uppercase transition-all hover:bg-red-700 active:scale-90"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
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

    return {
      props: {
        post: docData,
        markdown: markdown,
        author: resAuthor.data() as user,
        host: `${process.env.HOST}`,
      },
    };
  } else {
    return { notFound: true };
  }
};

export default PostPage;
