import React, { useEffect, useRef } from "react";
import { blockType, editorContent } from "..";

interface ParagraphProps {
  editorState: [
    editorContent,
    React.Dispatch<React.SetStateAction<editorContent>>
  ];
  idx: number;
  createBlockFx: (type: blockType) => void;
}

const Paragraph: React.FC<ParagraphProps> = ({
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
      newContent[idx] = { ...newContent[idx], text: e.target.value };
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
      placeholder="Write something incredible"
      ref={blockRef}
      className="bg-transparent border border-zinc-200 text-zinc-200 pt-3 pb-2 px-4 h-24 rounded-md focus:ring ring-blue-200"
      onKeyDown={handleKeyPress}
      onChange={handleChange}
      value={state.content[idx].text}
    ></textarea>
  );
};

export default Paragraph;
