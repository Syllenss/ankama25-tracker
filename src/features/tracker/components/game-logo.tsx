import Image from "next/image";
import type { Game } from "@/constants/games";
import { cn } from "@/lib/utils";

type GameLogoProps = {
  game: Game;
  className?: string;
  priority?: boolean;
};

export function GameLogo({ game, className, priority = false }: GameLogoProps) {
  return (
    <Image
      src={game.logo.src}
      alt={`Logo ${game.name}`}
      width={game.logo.width}
      height={game.logo.height}
      priority={priority}
      className={cn("h-10 w-auto object-contain drop-shadow-md", className)}
    />
  );
}
