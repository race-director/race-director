/**
 * @field coverImage - The cover image url and caption of the post.
 * @field metadata - The metadata of the post.
 * @field markdownUrl - The markdown url of the post.
 * @field id - The id of the post.
 * @field score - The score of the post.
 */
export interface post {
  coverImage: {
    coverImageUrl: string;
    coverImageCaption: string;
  };
  metadata: {
    headline: string;
    summary: string;
    author: string;
    createdAt: number;
    likeCount: number;
    commentCount: number;
    viewCount: number;
    shareCount: number;
  };
  score: number;
  markdownUrl: string;
  id: string;
}
