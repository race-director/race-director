import { doc, getDoc, getFirestore } from "firebase/firestore";
import Markdown from "markdown-to-jsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Navigation } from "../../components/Navigation";
import { FALLBACK_PHOTO_URL } from "../../components/Navigation/Auth/Auth";
import { post, user } from "../../types";
import { firebaseApp } from "../../utils/firebase";
import { toTitleCase } from "../../utils/other";

interface PostPageProps {
  post: post | null;
  markdown: string | null;
  author: user;
}

const PostPage: React.FC<PostPageProps> = ({ post, markdown, author }) => {
  return (
    <>
      {post ? (
        <div>
          <Head>
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
                          <div className="text-base flex space-x-2">
                            <p>2d ago</p> <span>·</span> <p>2.72k</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              )}
              {markdown && <Markdown>{markdown}</Markdown>}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Head>
            <title>404: Post Not Found</title>
          </Head>

          <div className="w-full flex flex-col items-center dark:bg-zinc-900 min-h-screen px-4">
            <Navigation></Navigation>
            <div className="px-4 prose prose-zinc max-w-3xl w-screen prose-red dark:prose-invert font-sans prose-h1:text-5xl prose-h2:text-3xl pt-12">
              <h1>We couldn't find what you were looking for...</h1>
              <Link href={"/"}>
                <a>Go back home</a>
              </Link>
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
    return {
      props: {
        post: docData,
        markdown: markdown,
        author: resAuthor.data() as user,
      },
    };
  } else {
    return {
      props: { post: null, markdown: "Test", author: null },
    };
  }
};

export default PostPage;
