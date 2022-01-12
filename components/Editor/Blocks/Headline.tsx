import React from "react";
import { blockType, editorContent } from "..";

interface HeadlineProps {
  editorState: [
    editorContent,
    React.Dispatch<React.SetStateAction<editorContent>>
  ];
  createBlockFx: (type: blockType) => void;
}

const Headline: React.FC<HeadlineProps> = ({ editorState, createBlockFx }) => {
  const [state, setState] = editorState;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!e.target.value.includes("\n")) {
      if (e.target.value.length <= 80) {
        setState({ ...state, headline: e.target.value.toUpperCase() });
      }
    } else {
      createBlockFx("paragraph");
    }
  };

  return (
    <textarea
      className="text-4xl font-bold bg-transparent border border-zinc-100 text-zinc-100 pt-5 pb-2 px-4 h-20 rounded-md focus:ring ring-blue-200"
      placeholder="ADD A HEADLINE"
      onChange={handleChange}
      value={state.headline}
    ></textarea>
  );
};

export default Headline;
