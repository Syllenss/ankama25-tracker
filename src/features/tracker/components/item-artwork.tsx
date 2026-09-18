"use client";

import Image from "next/image";
import { useState } from "react";
import type { LotteryItem } from "@/constants/lottery";
import { cn } from "@/lib/utils";

type ItemArtworkProps = {
  item: LotteryItem;
  className?: string;
};

/** Remote artwork from the source data, with the category icon as fallback. */
export function ItemArtwork({ item, className }: ItemArtworkProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const Icon = item.icon;
  const src = hasFailed ? null : item.assetUrl;
  const showImage = src !== null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-black/25",
        !showImage &&
          "border border-dashed border-border text-muted-foreground",
        className,
      )}
    >
      {src !== null ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="48px"
          className="object-contain p-1"
          onError={() => setHasFailed(true)}
        />
      ) : (
        <Icon className="size-7" strokeWidth={1.5} />
      )}
    </div>
  );
}
