import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { Auth } from "../../pages/_app";
import { sendWebhook } from "../../utils/discord";
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
      const postId = await submitPost(editorState, user);

      // Race director server
      await sendWebhook(
        "https://discord.com/api/webhooks/937729423015313518/E2IFzQzWgFXiZRBMmmT9cCVGgBynoOfWBZAPWJvcBvrbcv-h7-hoh1p_SctIzg8qi83L",
        "Look at this article that has just been posted!",
        editorState,
        postId,
        user
      ).catch((e) => {
        console.error(e);
      });

      // Drivetribe's Community Server
      await sendWebhook(
        "https://discordapp.com/api/webhooks/937883826326224936/ypBeF_UMzMo7J-Ps5nXdYtBqJTReZU5uop0051W_g1iCY7uatyep9Rmt_Vij7PcQUgUl",
        "",
        editorState,
        postId,
        user
      ).catch((e) => {
        console.error(e);
      });

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
    <div className="grid grid-cols-1 gap-4 pb-40">
      <AnimatePresence>
        {error && (
          <Backdrop onClick={() => setError(null)}>
            <Modal>
              <div className="grid gap-4 p-8">
                <h1 className="text-xl font-bold uppercase text-zinc-200/90">
                  We seem to have encountered an issue
                </h1>
                <p className="text-zinc-200/70">
                  Error message: {error.message}
                </p>
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
      <CoverImage editorState={[editorState, setEditorState]}></CoverImage>
      <Headline
        createBlockFx={createBlock}
        editorState={[editorState, setEditorState]}
      ></Headline>
      <textarea
        placeholder="Write a summary for your post"
        className="h-16 rounded-md border border-zinc-200 bg-transparent px-4 pt-3 pb-2 font-semibold text-zinc-200 ring-blue-200 focus:ring"
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
      <div className="fixed bottom-0 right-0 left-0 z-20 grid items-center justify-center bg-zinc-900 pb-4">
        <div className="grid w-screen max-w-5xl grid-cols-3 justify-between gap-x-2 gap-y-4 px-4">
          <button
            className="rounded-md border-2 border-zinc-200/90 py-2 font-semibold uppercase text-zinc-200 transition-colors hover:bg-zinc-800"
            onClick={() => createBlock("paragraph")}
          >
            Paragraph
          </button>
          <button
            className="rounded-md border-2 border-zinc-200/90 py-2 font-semibold uppercase text-zinc-200 transition-colors hover:bg-zinc-800"
            onClick={() => createBlock("subheading")}
          >
            Subheading
          </button>
          <button
            className="rounded-md border-2 border-zinc-200/90 py-2 font-semibold uppercase text-zinc-200 transition-colors hover:bg-zinc-800"
            onClick={() => createBlock("quote")}
          >
            Quote
          </button>
          <button
            disabled={loading}
            className="disabled:hover-bg-red-600 col-span-3 transform rounded-md bg-red-600 py-2 text-center font-bold uppercase text-zinc-200 transition-all hover:bg-red-700 active:scale-90 disabled:cursor-not-allowed disabled:opacity-70"
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
