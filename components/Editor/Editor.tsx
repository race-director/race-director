import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { Auth } from "../../pages/_app";
import { submitPost } from "../../utils/firebase";
import { Backdrop, Modal } from "../Menus";
import { CoverImage, Headline, Paragraph, Quote, Subheading } from "./Blocks";

interface EditorProps {
  initialEditorContent?: editorContent;
}

export interface editorContent {
  headline: string;
  summary: string;
  coverImage: {
    coverImageUrl: string;
    coverImageCaption: string;
  };
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
  const [user] = useContext(Auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<Error | null>(null);
  const [editorState, setEditorState] = useState<editorContent>(
    initialEditorContent || {
      coverImage: {
        coverImageCaption: "",
        coverImageUrl: "",
      },
      headline: "",
      summary: "",
      content: [{ text: "", type: "paragraph" }],
    }
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitPost(editorState, user);
      router.push("/studio");
    } catch (error) {
      setLoading(false);
      setError(error as Error);
    }
  };

  const createBlock = (type: blockType) => {
    setEditorState({
      ...editorState,
      content: [...editorState.content, { text: "", type }],
    });
  };

  return (
    <div className="grid gap-4 grid-cols-1 pb-40">
      <AnimatePresence>
        {error && (
          <Backdrop onClick={() => setError(null)}>
            <Modal>
              <div className="p-8 grid gap-4">
                <h1 className="text-xl text-zinc-200/90 font-bold uppercase">
                  We seem to have encountered an issue
                </h1>
                <p className="text-zinc-200/70">
                  Error message: {error.message}
                </p>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 pt-2 text-zinc-200">
                  <button
                    onClick={() => setError(null)}
                    className="bg-zinc-700 hover:bg-zinc-600 active:scale-90 transform transition-all py-2 uppercase font-bold text- rounded-md"
                  >
                    Okay
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="bg-red-600 text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
      <CoverImage editorState={[editorState, setEditorState]}></CoverImage>
      <Headline
        createBlockFx={createBlock}
        editorState={[editorState, setEditorState]}
      ></Headline>
      <textarea
        placeholder="Write a summary for your post"
        className="bg-transparent border border-zinc-200 text-zinc-200 pt-3 pb-2 px-4 h-16 font-semibold rounded-md focus:ring ring-blue-200"
        onChange={(e) =>
          setEditorState({ ...editorState, summary: e.target.value })
        }
        value={editorState.summary}
      ></textarea>
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
      <div className="fixed bottom-0 right-0 left-0 grid items-center justify-center z-20 bg-zinc-900 pb-4">
        <div className="max-w-5xl w-screen grid grid-cols-3 justify-between px-4 gap-x-2 gap-y-4">
          <button
            className="border-2 transition-colors hover:bg-zinc-800 border-zinc-200/90 py-2 rounded-md font-semibold uppercase text-zinc-200"
            onClick={() => createBlock("paragraph")}
          >
            Paragraph
          </button>
          <button
            className="border-2 transition-colors hover:bg-zinc-800 border-zinc-200/90 py-2 rounded-md font-semibold uppercase text-zinc-200"
            onClick={() => createBlock("subheading")}
          >
            Subheading
          </button>
          <button
            className="border-2 transition-colors hover:bg-zinc-800 border-zinc-200/90 py-2 rounded-md font-semibold uppercase text-zinc-200"
            onClick={() => createBlock("quote")}
          >
            Quote
          </button>
          <button
            disabled={loading}
            className="bg-red-600 disabled:opacity-70 disabled:hover-bg-red-600 disabled:cursor-not-allowed col-span-3 text-zinc-200 text-center hover:bg-red-700 active:scale-90 transform transition-all py-2 uppercase font-bold rounded-md"
            onClick={handleSubmit}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
