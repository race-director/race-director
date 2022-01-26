/**
 * @field email - The email of the user.
 * @field uid - The uid of the user.
 * @field displayName - The display name of the user.
 * @field photoURL - The photo url of the user.
 * @field bio - The bio of the user.
 */
type user = {
  email: string | null;
  uid: string;
  bio: string;
  displayName: string;
  photoURL: string;
  followers: number;
  following: number;
} | null;

export type { user };
