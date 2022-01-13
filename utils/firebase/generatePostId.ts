import { generateAlphanumericStr } from "../other";

const generatePostId = (s: string) => {
  const postId =
    s
      .replaceAll(" ", "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase() + `-${generateAlphanumericStr(20)}`;

  return postId;
};

export default generatePostId;
