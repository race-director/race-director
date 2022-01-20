import { interaction } from "../interaction";

/**
 *
 * @field postId - The post that the comment is on.
 * @field content - The content of the comment.
 * @field likes - The amount of likes of the comment.
 * @field nestedComments - The comments that are nested under this comment.
 *
 * @extends {interaction} - These are the interaction fields:
 * @field createdAt - The time the interaction was created at. `Date().getTime()`
 * @field userId - The user who created the interaction.
 */
export interface comment extends interaction {
  postId: string;
  content: string;
  likes: number;
  nestedComments: comment[];
  commentId: string;
}
