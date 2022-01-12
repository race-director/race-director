import React, { useState } from "react";
import { Headline, Paragraph, Quote, Subheading } from "./Blocks";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseApp } from "../../utils/firebase";

interface EditorProps {}

export interface editorContent {
  headline: string;
  content: block[];
}

export type blockType = "subheading" | "paragraph" | "image" | "quote";

interface block {
  type: blockType;
  text: string;
}

const Editor: React.FC<EditorProps> = () => {
  const [editorState, setEditorState] = useState<editorContent>({
    headline: "",
    content: [{ text: "", type: "paragraph" }],
  });

  const handleSubmit = async () => {
    const { headline, content } = editorState;
    let markdownStr = `# ${headline}\n\n`;

    content.forEach((block) => {
      if (block.type === "paragraph") {
        markdownStr += `${block.text}\n\n`;
      } else if (block.type === "subheading") {
        markdownStr += `## ${block.text}\n\n`;
      } else if (block.type === "quote") {
        markdownStr += `> ${block.text}\n\n`;
      }
    });

    const f = new File([markdownStr], "file.md");

    const storage = getStorage(firebaseApp);
    const fileRef = ref(
      storage,
      `/test-files/${headline
        .replaceAll(" ", "-")
        .replaceAll(":", "")
        .toLowerCase()}.md`
    );
    uploadBytes(fileRef, f);
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
