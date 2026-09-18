"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ reset }: ErrorProps) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
      <p className="text-muted-foreground">
        Le tracker n'a pas pu s'afficher. Vos données locales ne sont pas
        perdues.
      </p>
      <Button onClick={reset}>
        <RotateCcw data-icon="inline-start" />
        Réessayer
      </Button>
    </main>
  );
}
