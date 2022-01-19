interface post {
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
  markdownUrl: string;
  id: string;
}

export type { post };
