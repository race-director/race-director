import React from "react";
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newContent = state.content;
    newContent[idx] = { ...newContent[idx], text: e.target.value };
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
      onKeyDown={handleKeyPress}
      onChange={handleChange}
      value={state.content[idx].text}
    ></textarea>
  );
};

export default Quote;
