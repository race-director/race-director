import { interaction } from "../interaction";

/**
 *
 * @field followsBack - Boolean that shows wether or not the user follows back.
 *
 * @extends {interaction} - These are the interaction fields:
 * @field createdAt - The time the interaction was created at. `Date().getTime()`
 * @field userId - The user who created the interaction.
 */
export interface following extends interaction {}

/**
 *
 *
 * @extends {interaction} - These are the interaction fields:
 * @field createdAt - The time the interaction was created at. `Date().getTime()`
 * @field userId - The user who created the interaction.
 */
export interface follower extends interaction {}
