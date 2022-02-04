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
    <div className="grid min-h-screen w-full justify-center dark:bg-zinc-900">
      <div className="w-screen max-w-5xl px-4 pt-12">
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
        content: [{ text: "", type: "paragraph", author: "", imgSrc: "" }],
        headline: docData.metadata.headline,
        coverImage: { coverImageCaption: "", coverImageUrl: "" },
        summary: "",
      },
      postId: post || "",
    },
  };
};

export default PostEditor;
