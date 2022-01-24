import { post } from "../../types";

/**
 * @description
 * This function takes in a post and returns a rating between 0 and 1.
 * It does so by calculating the ratios between views, and interactions.
 * After that, depending on the type of interaction, it will have a different
 * weight.
 *
 * The weights are as follows:
 *  - Like: 27
 *  - Comment: 36
 *  - Share: 36
 *
 * These values can be changed to adjust the type of content that should be promoted.
 *
 * @param p post - The post to be rated
 * @returns number - A number between 0 and 1 representing the rating of the post
 *
 * @todo Add a way to change the weights
 */

const ratePost = (p: post): number => {
  const [likeWeight, commentWeight, shareWeight] = [27, 36, 36];

  const {
    metadata: { likeCount, commentCount, viewCount, shareCount },
  } = p;

  const [likeWeightedRatio, commentWeightedRatio, shareWeightedRatio] = [
    (likeCount / viewCount) * likeWeight,
    (commentCount / viewCount) * commentWeight,
    (shareCount / viewCount) * shareWeight,
  ];

  const score =
    (likeWeightedRatio + commentWeightedRatio + shareWeightedRatio) /
    (likeWeight + commentWeight + shareWeight);

  return isNaN(score) ? 0 : score;
};

export default ratePost;
