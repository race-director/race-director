import { block } from "../../components/Editor";
import { generatePostId } from "../firebase";

/**
 *
 * @param h string - The heading of the post. Needed for the filename
 * @param blocks block[] - The blocks of the post. These will be converted to markdown
 * @returns [File, string] - The file and the name of the file
 */
const convertBlocksToMarkDown = (
  h: string,
  blocks: block[]
): [File, string] => {
  let markdownStr = "";

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
