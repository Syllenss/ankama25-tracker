"use client";

import { Eye, EyeOff, LayoutGrid } from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { GAMES, type Game } from "@/constants/games";
import { cn } from "@/lib/utils";
import { GameLogo } from "./game-logo";

type GameFilterProps = {
  hasHiddenGames: boolean;
  itemsPerGame: number;
  isGameFollowed: (gameId: Game["id"]) => boolean;
  countForGame: (gameId: Game["id"]) => number;
  onToggleGame: (gameId: Game["id"]) => void;
  onFollowAll: () => void;
};

/** Every game is followed by default; clicking a tile stops following it. */
export function GameFilter({
  hasHiddenGames,
  itemsPerGame,
  isGameFollowed,
  countForGame,
  onToggleGame,
  onFollowAll,
}: GameFilterProps) {
  return (
    <nav aria-label="Jeux suivis" className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Mes jeux
          <span className="hidden sm:inline">
            {" "}
            · cliquez pour masquer un jeu
          </span>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFollowAll}
          disabled={!hasHiddenGames}
          className={cn("transition-opacity", !hasHiddenGames && "opacity-0")}
        >
          <LayoutGrid data-icon="inline-start" />
          Suivre tous les jeux
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {GAMES.map((game) => {
          const isFollowed = isGameFollowed(game.id);
          return (
            <button
              key={game.id}
              type="button"
              aria-pressed={isFollowed}
              onClick={() => onToggleGame(game.id)}
              style={{ "--game-accent": game.accent } as CSSProperties}
              className={cn(
                "group flex items-center gap-3 rounded-xl border bg-card p-2.5 text-left transition-all outline-none",
                "focus-visible:ring-3 focus-visible:ring-ring/50",
                isFollowed
                  ? "border-(--game-accent) shadow-[inset_0_0_0_1px_var(--game-accent)]"
                  : "border-border opacity-55 grayscale hover:opacity-90 hover:grayscale-0",
              )}
            >
              <GameLogo game={game} className="h-8 shrink-0" priority />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold">
                  {game.name}
                </span>
                <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                  {countForGame(game.id)} / {itemsPerGame} obtenus
                </span>
              </span>
              {isFollowed ? (
                <Eye className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
              ) : (
                <EyeOff className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
