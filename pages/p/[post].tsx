import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Markdown from "markdown-to-jsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import parseMD from "parse-md";
import React from "react";
import { post } from "../../types";
import { firebaseApp } from "../../utils/firebase";
import { toTitleCase } from "../../utils/other";

type metadata = {
  title: string;
  author: string;
};

interface PostPageProps {
  post: post;
  markdown: string;
}

const PostPage: React.FC<PostPageProps> = ({ post, markdown }) => {
  const { metadata } = post;
  return (
    <div>
      <Head>
        <title>{toTitleCase(metadata.headline)}</title>
      </Head>
      {markdown && (
        <Markdown
          options={{
            wrapper: ({ children }) => (
              <div className="w-full grid justify-center dark:bg-zinc-900 min-h-screen py-12 px-4">
                <div className="prose prose-zinc max-w-3xl w-screen dark:prose-invert font-sans prose-h1:text-5xl prose-h2:text-3xl">
                  {children}
                </div>
              </div>
            ),
          }}
        >
          {markdown}
        </Markdown>
      )}
    </div>
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
  const docData = docRes.data() as post;
  const markdown = await (await fetch(docData.markdownUrl)).text();

  return {
    props: {
      post: docData,
      markdown: markdown,
    },
  };
};

export default PostPage;
