import React, { useEffect, useRef } from "react";
import { editorContent } from "..";

interface QuoteProps {
  editorState: [
    editorContent,
    React.Dispatch<React.SetStateAction<editorContent>>
  ];
  idx: number;
}

const Quote: React.FC<QuoteProps> = ({ editorState, idx }) => {
  const [state, setState] = editorState;
  const blockRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    blockRef.current.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newContent = state.content;
    newContent[idx] = {
      ...newContent[idx],
      text: e.target.value,
    };
    setState({ ...state, content: newContent });
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
      ref={blockRef}
      onKeyDown={handleKeyPress}
      onChange={handleChange}
      value={state.content[idx].text}
      className="h-24 rounded-md border border-zinc-200 bg-transparent px-4 pt-3 pb-2 italic text-zinc-200 ring-blue-200 focus:ring"
      placeholder="Write a quote"
    ></textarea>
  );
};

export default Quote;
