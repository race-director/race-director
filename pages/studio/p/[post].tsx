import { doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSideProps } from "next";
import React from "react";
import { Editor, editorContent } from "../../../components/Editor";
import { post } from "../../../types";
import { firebaseApp } from "../../../utils/firebase";

interface PostEditorProps {
  initialEditorContent: editorContent;
  postId: string;
}

const PostEditor: React.FC<PostEditorProps> = ({ initialEditorContent }) => {
  return (
    <div className="dark:bg-zinc-900 min-h-screen w-full grid justify-center">
      <div className="pt-12 px-4 max-w-5xl w-screen">
        <Editor initialEditorContent={initialEditorContent}></Editor>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PostEditorProps> = async (
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

  // TODO: Change this to be user based
  const db = getFirestore(firebaseApp);
  const docRef = doc(db, "posts", post || "");
  const docRes = await getDoc(docRef);
  const docData = docRes.data() as post;

  return {
    props: {
      initialEditorContent: {
        content: [{ text: "", type: "paragraph" }],
        headline: docData.metadata.headline,
      },
      postId: post || "",
    },
  };
};

export default PostEditor;
