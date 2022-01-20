import { interaction } from "../interaction";

/**
 *
 * @field commentId - The comment this like is linked to.
 *
 * @extends {interaction} - These are the interaction fields:
 * @field createdAt - The time the interaction was created at. `Date().getTime()`
 * @field userId - The user who created the interaction.
 */
export interface commentLike extends interaction {
  commentId: string;
}

/**
 *
 * @field postId - The post this like is linked to.
 *
 * @extends {interaction} - These are the interaction fields:
 * @field createdAt - The time the interaction was created at. `Date().getTime()`
 * @field userId - The user who created the interaction.
 */
export interface postLike extends interaction {
  postId: string;
}
