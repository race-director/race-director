import React, { useEffect, useRef } from "react";
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
  const blockRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    blockRef.current.focus();
  }, []);

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
      className="h-20 rounded-md border border-zinc-100 bg-transparent px-4 pt-5 pb-2 text-2xl font-bold text-zinc-100 ring-blue-200 focus:ring"
      onKeyDown={handleKeyPress}
      onChange={handleChange}
      value={state.content[idx].text}
      placeholder="Write your subheading"
      ref={blockRef}
    ></textarea>
  );
};

export default Subheading;
