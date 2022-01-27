import { generateAlphanumericStr } from "../other";

/**
 * @description
 * This function takes in a string, normally a post's title, and returns a string
 * that is safe to use as a post id. All the unsafe characters are replaced with
 * dashes, and the string is converted to lowercase. After thtat, a 20-character
 * alphanumeric string is appended at the end of the string.
 *
 * @param s string - The string from which to generate a post id
 * @returns string - The generated post id
 *
 * @example
 * generatePostId("Hello World") // "hello-world-xxxxxxxxxxxxxxxxxxxx"
 *
 * @todo Normalize the string length by cutting the post's title to a certain length
 *
 */

const generatePostId = (s: string) => {
  const postId =
    s
      .replaceAll("-", "")
      .replaceAll(" ", "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .replaceAll("--", "-")
      .toLowerCase() + `-${generateAlphanumericStr(20)}`;

  return postId;
};

export default generatePostId;
