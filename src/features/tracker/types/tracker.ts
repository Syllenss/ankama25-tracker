import type { GameId } from "@/constants/games";

/** Stable key identifying one lottery item copy in one game: `<game>:<item id>`. */
export type ObtainedKey = `${GameId}:${string}`;

export type TrackerState = {
  /** Item copies the player already got. */
  obtained: readonly ObtainedKey[];
  /** Games the player does not follow. Every game is followed by default. */
  hiddenGames: readonly GameId[];
};
