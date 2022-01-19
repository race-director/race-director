export type comment = {
  content: string;
  createdAt: number;
  userId: string;
  postId: string;
  likes?: number;
  nestedComments?: comment[];
};
