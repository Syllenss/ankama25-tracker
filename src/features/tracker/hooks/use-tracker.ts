import { useSyncExternalStore } from "react";
import { GAMES, type GameId } from "@/constants/games";
import {
  ITEMS,
  isBundle,
  type LotteryItem,
  type Season,
} from "@/constants/lottery";
import {
  followAllGames,
  getServerSnapshot,
  getSnapshot,
  resetObtained,
  setObtained,
  subscribe,
  toggleGame,
  toggleObtained,
} from "../stores/tracker-store";
import type { ObtainedKey } from "../types/tracker";

export function toObtainedKey(gameId: GameId, itemId: string): ObtainedKey {
  return `${gameId}:${itemId}`;
}

/**
 * Counts are always relative to the games the player follows: someone who
 * only plays Wakfu tracks ITEMS.length copies, not ITEMS.length × 4.
 * A bundle is obtained when every piece of its season is, and toggling it
 * toggles all of them at once.
 */
export function useTracker() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const obtained = new Set(state.obtained);
  const hasKey = (gameId: GameId, itemId: string) =>
    obtained.has(toObtainedKey(gameId, itemId));

  const isObtained = (gameId: GameId, item: LotteryItem) =>
    isBundle(item)
      ? item.pieceIds.every((pieceId) => hasKey(gameId, pieceId))
      : hasKey(gameId, item.id);

  const toggleItem = (gameId: GameId, item: LotteryItem) => {
    if (!isBundle(item)) {
      toggleObtained(toObtainedKey(gameId, item.id));
      return;
    }
    const keys = item.pieceIds.map((pieceId) => toObtainedKey(gameId, pieceId));
    setObtained(keys, !isObtained(gameId, item));
  };

  const isGameFollowed = (gameId: GameId) =>
    !state.hiddenGames.includes(gameId);

  const visibleGames = GAMES.filter((game) => isGameFollowed(game.id));

  const countForGame = (gameId: GameId) =>
    ITEMS.filter((item) => isObtained(gameId, item)).length;

  const countForSeason = (season: Season) =>
    season.items.reduce(
      (total, item) =>
        total + visibleGames.filter((game) => isObtained(game.id, item)).length,
      0,
    );

  const obtainedCount = visibleGames.reduce(
    (total, game) => total + countForGame(game.id),
    0,
  );

  return {
    obtainedCount,
    totalCount: ITEMS.length * visibleGames.length,
    itemsPerGame: ITEMS.length,
    hasHiddenGames: state.hiddenGames.length > 0,
    visibleGames,
    isObtained,
    isGameFollowed,
    countForGame,
    countForSeason,
    toggleObtained: toggleItem,
    toggleGame,
    followAllGames,
    resetObtained,
  };
}
