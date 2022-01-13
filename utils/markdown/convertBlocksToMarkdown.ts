import { block } from "../../components/Editor";
import { generatePostId } from "../firebase";

const convertBlocksToMarkDown = (
  h: string,
  blocks: block[]
): [File, string] => {
  let markdownStr = `# ${h}\n\n`;

  blocks.forEach((block) => {
    if (block.type === "paragraph") {
      markdownStr += `${block.text}\n\n`;
    } else if (block.type === "subheading") {
      markdownStr += `## ${block.text}\n\n`;
    } else if (block.type === "quote") {
      markdownStr += `> ${block.text}\n\n`;
    }
  });

  const filename = generatePostId(h) + ".md";
  const markdownFile = new File([markdownStr], filename);
  return [markdownFile, filename];
};

export default convertBlocksToMarkDown;
