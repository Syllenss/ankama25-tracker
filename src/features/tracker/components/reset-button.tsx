"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CONFIRM_TIMEOUT_MS = 4000;

type ResetButtonProps = {
  disabled: boolean;
  onReset: () => void;
};

/** Two-step reset: the first click arms the button, the second confirms. */
export function ResetButton({ disabled, onReset }: ResetButtonProps) {
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    if (!isArmed) return;
    const timer = window.setTimeout(
      () => setIsArmed(false),
      CONFIRM_TIMEOUT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [isArmed]);

  function handleClick() {
    if (!isArmed) {
      setIsArmed(true);
      return;
    }
    onReset();
    setIsArmed(false);
  }

  return (
    <Button
      variant={isArmed ? "destructive" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      aria-live="polite"
    >
      {isArmed ? (
        <TriangleAlert data-icon="inline-start" />
      ) : (
        <RotateCcw data-icon="inline-start" />
      )}
      {isArmed ? "Confirmer la remise à zéro" : "Tout décocher"}
    </Button>
  );
}
