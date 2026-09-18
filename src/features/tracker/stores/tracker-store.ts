import { GAME_IDS, type GameId } from "@/constants/games";
import { PIECES } from "@/constants/lottery";
import type { ObtainedKey, TrackerState } from "../types/tracker";

/**
 * Minimal external store persisted in localStorage.
 * Consumed through `useSyncExternalStore` (see hooks/use-tracker.ts) so the
 * server renders an empty state and the client hydrates then swaps to the
 * persisted one without a hydration mismatch.
 */

const STORAGE_KEY = "ankama25-tracker";
const STORAGE_VERSION = 2;

type Persisted = {
  version: number;
  obtained: unknown;
  hiddenGames?: unknown;
  /** Version 1 stored the followed games instead of the hidden ones. */
  selectedGames?: unknown;
};

const EMPTY_STATE: TrackerState = { obtained: [], hiddenGames: [] };

const VALID_KEYS = new Set<string>(
  GAME_IDS.flatMap((game) => PIECES.map((item) => `${game}:${item.id}`)),
);

let state: TrackerState | null = null;
const listeners = new Set<() => void>();

function isGameId(value: unknown): value is GameId {
  return (
    typeof value === "string" && (GAME_IDS as readonly string[]).includes(value)
  );
}

function isObtainedKey(value: unknown): value is ObtainedKey {
  return typeof value === "string" && VALID_KEYS.has(value);
}

function toGameIds(value: unknown): GameId[] {
  return Array.isArray(value) ? value.filter(isGameId) : [];
}

function sanitize(raw: Persisted): TrackerState {
  if (raw.version !== 1 && raw.version !== STORAGE_VERSION) return EMPTY_STATE;
  const obtained = Array.isArray(raw.obtained)
    ? raw.obtained.filter(isObtainedKey)
    : [];
  if (raw.version === 1) {
    const selected = toGameIds(raw.selectedGames);
    const hiddenGames =
      selected.length === 0
        ? []
        : GAME_IDS.filter((game) => !selected.includes(game));
    return { obtained, hiddenGames };
  }
  return { obtained, hiddenGames: toGameIds(raw.hiddenGames) };
}

function readStorage(): TrackerState {
  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (serialized === null) return EMPTY_STATE;
    return sanitize(JSON.parse(serialized) as Persisted);
  } catch {
    // Deliberate fallback: storage unavailable (private mode, blocked) or
    // corrupted payload. The tracker keeps working in memory for the session.
    return EMPTY_STATE;
  }
}

function writeStorage(next: TrackerState) {
  const payload: Persisted = { version: STORAGE_VERSION, ...next };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Deliberate fallback: same as readStorage, in-memory state stays valid.
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function setState(next: TrackerState) {
  state = next;
  writeStorage(next);
  emit();
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  state = readStorage();
  emit();
}

export function getSnapshot(): TrackerState {
  if (state === null) state = readStorage();
  return state;
}

export function getServerSnapshot(): TrackerState {
  return EMPTY_STATE;
}

export function subscribe(listener: () => void) {
  if (listeners.size === 0)
    window.addEventListener("storage", handleStorageEvent);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0)
      window.removeEventListener("storage", handleStorageEvent);
  };
}

export function toggleObtained(key: ObtainedKey) {
  const current = getSnapshot();
  setObtained([key], !current.obtained.includes(key));
}

/** Marks several copies at once (used by bundles). */
export function setObtained(keys: readonly ObtainedKey[], isObtained: boolean) {
  const current = getSnapshot();
  const obtained = isObtained
    ? [...new Set([...current.obtained, ...keys])]
    : current.obtained.filter((item) => !keys.includes(item));
  setState({ ...current, obtained });
}

/** Stops or resumes following a game. */
export function toggleGame(gameId: GameId) {
  const current = getSnapshot();
  const hiddenGames = current.hiddenGames.includes(gameId)
    ? current.hiddenGames.filter((item) => item !== gameId)
    : [...current.hiddenGames, gameId];
  setState({ ...current, hiddenGames });
}

export function followAllGames() {
  const current = getSnapshot();
  if (current.hiddenGames.length === 0) return;
  setState({ ...current, hiddenGames: [] });
}

export function resetObtained() {
  const current = getSnapshot();
  if (current.obtained.length === 0) return;
  setState({ ...current, obtained: [] });
}
