"use client";

import { CalendarClock } from "lucide-react";
import type { CSSProperties } from "react";
import type { Game } from "@/constants/games";
import type { LotteryItem, Season } from "@/constants/lottery";
import { cn } from "@/lib/utils";
import { ItemCard } from "./item-card";

type SeasonSectionProps = {
  season: Season;
  index: number;
  games: readonly Game[];
  obtainedCount: number;
  isObtained: (gameId: Game["id"], item: LotteryItem) => boolean;
  onToggle: (gameId: Game["id"], item: LotteryItem) => void;
};

export function SeasonSection({
  season,
  index,
  games,
  obtainedCount,
  isObtained,
  onToggle,
}: SeasonSectionProps) {
  const headingId = `season-${season.id}`;
  const totalCount = season.items.length * games.length;
  const isComplete = totalCount > 0 && obtainedCount === totalCount;

  return (
    <section
      aria-labelledby={headingId}
      style={{ "--season-accent": season.accent } as CSSProperties}
      className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          aria-hidden="true"
          className="size-3 shrink-0 self-center rounded-full bg-(--season-accent) shadow-[0_0_12px_var(--season-accent)]"
        />
        <h2 id={headingId} className="text-lg font-semibold">
          <span className="text-muted-foreground">Saison {index + 1} · </span>
          {season.name}
        </h2>
        <p className="text-sm text-muted-foreground">{season.period}</p>
        {season.isUpcoming ? null : (
          <p
            className={cn(
              "ml-auto text-sm text-muted-foreground tabular-nums",
              isComplete && "text-primary",
            )}
          >
            <span className="font-semibold text-foreground">
              {obtainedCount}
            </span>{" "}
            / {totalCount}
          </p>
        )}
      </header>

      {season.isUpcoming ? (
        <p className="flex items-center gap-3 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          <CalendarClock className="size-5 shrink-0" />
          Les lots de cette saison ne sont pas encore annoncés.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {season.items.map((item) => (
            <li key={item.id} className="flex">
              <ItemCard
                item={item}
                games={games}
                isObtained={(gameId) => isObtained(gameId, item)}
                onToggle={(gameId) => onToggle(gameId, item)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
