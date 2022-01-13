import React, { useState } from "react";
import { Headline, Paragraph, Quote, Subheading } from "./Blocks";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";
import { convertBlocksToMarkDown } from "../../utils/markdown";
import { post } from "../../types";

interface EditorProps {
  initialEditorContent?: editorContent;
}

export interface editorContent {
  headline: string;
  content: block[];
}

export type blockType = "subheading" | "paragraph" | "image" | "quote";

export interface block {
  type: blockType;
  text: string;
  imgSrc?: string;
  author?: string;
}

const Editor: React.FC<EditorProps> = ({ initialEditorContent }) => {
  const [editorState, setEditorState] = useState<editorContent>(
    initialEditorContent || {
      headline: "",
      content: [{ text: "", type: "paragraph" }],
    }
  );

  const handleSubmit = async () => {
    const { headline, content } = editorState;
    const [markdownFile, filename] = convertBlocksToMarkDown(headline, content);

    // Handle cloud storage upload
    const storage = getStorage(firebaseApp);
    const fileRef = ref(storage, `/posts/${filename}`);
    const res = await uploadBytes(fileRef, markdownFile);
    const downloadURL = await getDownloadURL(res.ref);

    //Handle db post creation
    let postId = filename.replace(".md", "");
    const dbPost: post = {
      coverImage: { coverImageCaption: "", coverImageUrl: "" },
      id: postId,
      markdownUrl: downloadURL,
      metadata: {
        author: "",
        createdAt: new Date().getTime(),
        headline: headline,
        summary: "Summary",
      },
    };

    // Upload post to the db
    const db = getFirestore(firebaseApp);
    const postDoc = doc(db, "posts", postId);
    await setDoc(postDoc, dbPost);
  };

  const createBlock = (type: blockType) => {
    setEditorState({
      ...editorState,
      content: [...editorState.content, { text: "", type }],
    });
  };

  return (
    <div className="grid gap-4 grid-cols-1">
      <Headline
        createBlockFx={createBlock}
        editorState={[editorState, setEditorState]}
      ></Headline>
      {editorState.content.map(({ type }, idx) => {
        switch (type) {
          case "paragraph":
            return (
              <Paragraph
                createBlockFx={createBlock}
                idx={idx}
                key={idx}
                editorState={[editorState, setEditorState]}
              ></Paragraph>
            );
          case "subheading":
            return (
              <Subheading
                createBlockFx={createBlock}
                idx={idx}
                key={idx}
                editorState={[editorState, setEditorState]}
              ></Subheading>
            );
          case "quote":
            return (
              <Quote
                idx={idx}
                key={idx}
                editorState={[editorState, setEditorState]}
              ></Quote>
            );
        }
      })}
      <button onClick={() => createBlock("paragraph")}>New Paragraph</button>
      <button onClick={() => createBlock("subheading")}>New Subheading</button>
      <button onClick={() => createBlock("quote")}>New Quote</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Editor;
