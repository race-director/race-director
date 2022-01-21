import { post } from "../../types";

/**
 *
 * @param p post - The post where the comments are being loaded from
 * @param commentAmount number - The amount of comments currently loaded
 * @returns number - The amount of comments to be loaded
 */
const loadMoreComments = (p: post, commentAmount: number): number => {
  const dif = p.metadata.commentCount - commentAmount;
  return dif >= 3 ? 3 : dif;
};

export default loadMoreComments;
