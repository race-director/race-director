import React, { useContext } from "react";
import Head from "next/head";
import { Navigation } from "../../../components/Navigation";
import { Auth } from "../../_app";
import { Editor } from "../../../components/Editor";

interface NewPostPageProps {}

const NewPostPage: React.FC<NewPostPageProps> = () => {
  const [user] = useContext(Auth);

  return (
    <div className="flex min-h-screen w-full flex-col items-center dark:bg-zinc-900">
      <Head>
        <title>Race Director - Studio</title>
      </Head>
      <Navigation></Navigation>
      {user && (
        <div className="w-full max-w-5xl px-4 pt-12">
          <Editor></Editor>
        </div>
      )}
    </div>
  );
};

export default NewPostPage;
