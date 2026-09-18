"use client";

import { Check, CircleCheck } from "lucide-react";
import type { Game } from "@/constants/games";
import {
  isBundle,
  type LotteryItem,
  RARITY_CARD_CLASSES,
} from "@/constants/lottery";
import { cn } from "@/lib/utils";
import { GameLogo } from "./game-logo";
import { ItemArtwork } from "./item-artwork";

type ItemCardProps = {
  item: LotteryItem;
  games: readonly Game[];
  isObtained: (gameId: Game["id"]) => boolean;
  onToggle: (gameId: Game["id"]) => void;
};

export function ItemCard({ item, games, isObtained, onToggle }: ItemCardProps) {
  const obtainedCount = games.filter((game) => isObtained(game.id)).length;
  const isComplete = games.length > 0 && obtainedCount === games.length;
  // Bundles share the same name across seasons: disambiguate for screen readers.
  const accessibleName = isBundle(item)
    ? `${item.name} (${item.seasonName})`
    : item.name;

  return (
    <article
      aria-label={`${item.name}, ${item.rarity}`}
      className={cn(
        "flex w-full flex-col gap-2.5 rounded-lg border p-2.5 transition-colors",
        RARITY_CARD_CLASSES[item.rarity],
        isComplete && "ring-2 ring-primary/70",
      )}
    >
      <div className="flex items-center gap-2.5">
        <ItemArtwork item={item} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="text-sm leading-tight font-semibold">{item.name}</h3>
          <p className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate">
              {item.category} · {item.rarity}
            </span>
            <span
              className={cn(
                "flex shrink-0 items-center gap-1 tabular-nums",
                isComplete && "font-medium text-primary",
              )}
            >
              {isComplete ? <CircleCheck className="size-3.5" /> : null}
              {obtainedCount}/{games.length}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-auto flex gap-1.5">
        {games.map((game) => {
          const isOn = isObtained(game.id);
          return (
            <button
              key={game.id}
              type="button"
              aria-pressed={isOn}
              aria-label={`${accessibleName} obtenu sur ${game.name}`}
              title={game.name}
              onClick={() => onToggle(game.id)}
              className={cn(
                "relative flex h-8 flex-1 items-center justify-center rounded-md border transition-all outline-none",
                "focus-visible:ring-3 focus-visible:ring-ring/50",
                isOn
                  ? "border-primary/60 bg-primary/15"
                  : "border-border bg-background/40 opacity-70 grayscale hover:border-foreground/40 hover:opacity-100 hover:grayscale-0",
              )}
            >
              <GameLogo game={game} className="h-5 drop-shadow-none" />
              {isOn ? (
                <span className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </article>
  );
}
