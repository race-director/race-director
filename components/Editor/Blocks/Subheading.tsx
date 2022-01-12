import React from "react";
import { blockType, editorContent } from "..";

interface SubheadingProps {
  editorState: [
    editorContent,
    React.Dispatch<React.SetStateAction<editorContent>>
  ];
  idx: number;
  createBlockFx: (type: blockType) => void;
}

const Subheading: React.FC<SubheadingProps> = ({
  editorState,
  idx,
  createBlockFx,
}) => {
  const [state, setState] = editorState;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!e.target.value.includes("\n")) {
      let newContent = state.content;
      newContent[idx] = {
        ...newContent[idx],
        text: e.target.value.toUpperCase(),
      };
      setState({ ...state, content: newContent });
    } else {
      createBlockFx("paragraph");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!state.content[idx].text && e.key === "Backspace") {
      let newContent = state.content;
      newContent.splice(idx, 1);
      setState({ ...state, content: newContent });
    }
  };

  return (
    <textarea
      className="text-2xl font-bold bg-transparent border border-zinc-100 text-zinc-100 pt-5 pb-2 px-4 h-20 rounded-md focus:ring ring-blue-200"
      onKeyDown={handleKeyPress}
      onChange={handleChange}
      value={state.content[idx].text}
    ></textarea>
  );
};

export default Subheading;
