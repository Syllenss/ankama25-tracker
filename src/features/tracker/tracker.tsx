"use client";

import { Database, ExternalLink, EyeOff, PartyPopper } from "lucide-react";
import { LOTTERY_SOURCE_URL, SEASONS } from "@/constants/lottery";
import { GameFilter } from "./components/game-filter";
import { ResetButton } from "./components/reset-button";
import { SeasonSection } from "./components/season-section";
import { useTracker } from "./hooks/use-tracker";

export function Tracker() {
  const tracker = useTracker();
  const isComplete =
    tracker.totalCount > 0 && tracker.obtainedCount === tracker.totalCount;

  return (
    <div className="flex flex-1 flex-col">
      <header className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_55%)] opacity-15"
        />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-10 sm:px-6 lg:py-12">
          <p className="text-sm font-medium tracking-widest text-primary uppercase">
            Ankama · 25 ans · Loterie en kamas
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            L'Héritage des Dofus
          </h1>
        </div>
      </header>

      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
          <GameFilter
            hasHiddenGames={tracker.hasHiddenGames}
            itemsPerGame={tracker.itemsPerGame}
            isGameFollowed={tracker.isGameFollowed}
            countForGame={tracker.countForGame}
            onToggleGame={tracker.toggleGame}
            onFollowAll={tracker.followAllGames}
          />
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-10 sm:px-6">
        {isComplete ? (
          <output className="flex items-center gap-3 rounded-xl border border-primary/50 bg-primary/10 p-4 text-sm font-medium">
            <PartyPopper className="size-5 shrink-0 text-primary" />
            Collection complète ! Vous avez obtenu tous les lots annoncés sur
            vos jeux.
          </output>
        ) : null}

        {tracker.visibleGames.length === 0 ? (
          <p className="flex items-center gap-3 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            <EyeOff className="size-5 shrink-0" />
            Aucun jeu suivi. Réactivez un jeu dans la barre ci-dessus.
          </p>
        ) : null}

        {tracker.visibleGames.length === 0
          ? null
          : SEASONS.map((season, index) => (
              <SeasonSection
                key={season.id}
                season={season}
                index={index}
                games={tracker.visibleGames}
                obtainedCount={tracker.countForSeason(season)}
                isObtained={tracker.isObtained}
                onToggle={tracker.toggleObtained}
              />
            ))}
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-2">
              <Database className="size-4 shrink-0" />
              Vos coches et votre filtre de jeux sont stockés localement dans ce
              navigateur.
            </p>
            <a
              href={LOTTERY_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 underline-offset-4 hover:text-foreground hover:underline"
            >
              <ExternalLink className="size-4 shrink-0" />
              Liste des lots et images d'après Method Wakfu
            </a>
          </div>
          <ResetButton
            disabled={tracker.obtainedCount === 0}
            onReset={tracker.resetObtained}
          />
        </div>
      </footer>
    </div>
  );
}
