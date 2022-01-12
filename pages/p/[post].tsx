import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Markdown from "markdown-to-jsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import parseMD from "parse-md";
import React from "react";
import { firebaseApp } from "../../utils/firebase";

type metadata = {
  title: string;
  author: string;
};

interface PostPageProps {
  content: string | null;
  metadata: metadata;
}

const PostPage: React.FC<PostPageProps> = ({ content, metadata }) => {
  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
      </Head>
      {content && (
        <Markdown
          options={{
            wrapper: ({ children }) => (
              <div className="w-full grid justify-center dark:bg-zinc-900 min-h-screen py-12 px-4">
                <div className="prose prose-zinc max-w-3xl w-screen dark:prose-invert font-sans prose-h1:text-5xl prose-h2:text-3xl">
                  {children}
                </div>
              </div>
            ),
            overrides: {
              img: () => <></>,
            },
          }}
        >
          {content}
        </Markdown>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (
  c
) => {
  let post: string | null = null;
  if (c.params?.post) {
    if (typeof c.params.post === "string") {
      post = c.params.post;
    } else {
      post = c.params.post[0];
    }
  }

  const storage = getStorage(firebaseApp);
  const pathReference = ref(storage, `test-files/${post}.md`);
  const downloadUrl = await getDownloadURL(pathReference);
  const res = await fetch(downloadUrl);

  const { content, metadata } = parseMD(await res.text());

  return {
    props: {
      content: content,
      metadata: metadata as metadata,
    },
  };
};

export default PostPage;
