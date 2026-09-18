export const GAME_IDS = [
  "dofus",
  "dofus-retro",
  "dofus-touch",
  "wakfu",
] as const;

export type GameId = (typeof GAME_IDS)[number];

export type Game = {
  id: GameId;
  name: string;
  logo: { src: string; width: number; height: number };
  /** Accent color used for the game's section and filter tile (oklch). */
  accent: string;
};

export const GAMES: readonly Game[] = [
  {
    id: "dofus",
    name: "Dofus",
    logo: { src: "/logos/dofus-logo.png", width: 568, height: 428 },
    accent: "oklch(0.82 0.16 85)",
  },
  {
    id: "dofus-retro",
    name: "Dofus Retro",
    logo: { src: "/logos/dofus-retro-logo.png", width: 416, height: 306 },
    accent: "oklch(0.74 0.14 60)",
  },
  {
    id: "dofus-touch",
    name: "Dofus Touch",
    logo: { src: "/logos/dofus-touch-logo.png", width: 848, height: 615 },
    accent: "oklch(0.78 0.17 130)",
  },
  {
    id: "wakfu",
    name: "Wakfu",
    logo: { src: "/logos/wakfu-logo.png", width: 500, height: 309 },
    accent: "oklch(0.74 0.12 195)",
  },
];
