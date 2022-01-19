import { post } from "../../types";

const ratePost = (p: post): number => {
  const [likeWeight, commentWeight, shareWeight] = [30, 40, 40];

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

  return score;
};

export default ratePost;
