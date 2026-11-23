import {
  Crown,
  Footprints,
  Gem,
  type LucideIcon,
  PawPrint,
  Shield,
  Shirt,
  Sparkles,
} from "lucide-react";
import lottery from "@/data/heritage_dofus_loterie.json";

export const RARITIES = ["Commun", "Rare", "Épique", "Légendaire"] as const;
export type Rarity = (typeof RARITIES)[number];

export const CATEGORIES = [
  "Cape",
  "Coiffe",
  "Bottes",
  "Bouclier",
  "Familier",
  "Panoplie",
  "Objet",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type LotteryItem = {
  /** Stable id used in persisted keys: `<season>-<slug>`. */
  id: string;
  seasonId: string;
  seasonName: string;
  name: string;
  rarity: Rarity;
  category: Category;
  /** Fallback icon shown when the item has no artwork. */
  icon: LucideIcon;
  /**
   * Local artwork `/items/<id>.webp` (public/items), or null when the source
   * data has no image for the item (bundles, items without artwork yet).
   */
  assetUrl: string | null;
  /**
   * For a bundle ("panoplie complète"): ids of the season pieces it groups.
   * A bundle has no state of its own, it is obtained when every piece is.
   */
  pieceIds: readonly string[];
};

export type Season = {
  id: string;
  name: string;
  period: string;
  /** Accent color for the season header (oklch). */
  accent: string;
  isUpcoming: boolean;
  items: readonly LotteryItem[];
};

/** Card surface per rarity: tinted border and background. */
export const RARITY_CARD_CLASSES: Record<Rarity, string> = {
  Commun: "border-border bg-card",
  Rare: "border-sky-500/40 bg-sky-500/10",
  Épique: "border-fuchsia-500/40 bg-fuchsia-500/10",
  Légendaire: "border-primary/50 bg-primary/10",
};

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  Cape: Shirt,
  Coiffe: Crown,
  Bottes: Footprints,
  Bouclier: Shield,
  Familier: PawPrint,
  Panoplie: Gem,
  Objet: Sparkles,
};

const SEASON_ACCENTS: Record<string, string> = {
  emeraude: "oklch(0.75 0.17 155)",
  turquoise: "oklch(0.78 0.13 195)",
  pourpre: "oklch(0.65 0.2 15)",
  ocre: "oklch(0.75 0.15 65)",
  ivoire: "oklch(0.92 0.03 90)",
  ebene: "oklch(0.5 0.02 280)",
};
const DEFAULT_ACCENT = "oklch(0.7 0 0)";

/** Ordered keyword rules; the first match wins. */
const CATEGORY_RULES: readonly [Category, RegExp][] = [
  ["Panoplie", /panoplie/],
  ["Familier", /familier/],
  ["Bouclier", /bouclier/],
  ["Bottes", /bott|soleret|basalte/],
  ["Coiffe", /coiffe|casque|heaume|masque|diad/],
  ["Cape", /cape|manteau/],
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isRarity(value: string): value is Rarity {
  return (RARITIES as readonly string[]).includes(value);
}

function inferCategory(name: string, note: string | undefined): Category {
  // Notes are more explicit than names ("Cape - image hébergée…").
  const haystack = `${note ?? ""} ${name}`.toLowerCase();
  const match = CATEGORY_RULES.find(([, pattern]) => pattern.test(haystack));
  return match?.[0] ?? "Objet";
}

type RawItem = (typeof lottery.saisons)[number]["items"][number];

function toItem(
  raw: RawItem,
  seasonId: string,
  seasonName: string,
): LotteryItem {
  if (!isRarity(raw.rarete)) {
    throw new Error(
      `Unknown rarity "${raw.rarete}" for item "${raw.nom}" (season ${seasonId})`,
    );
  }
  const note = "note" in raw ? raw.note : undefined;
  const category = inferCategory(raw.nom, note);
  const id = `${seasonId}-${slugify(raw.nom)}`;
  return {
    id,
    seasonId,
    seasonName,
    name: raw.nom,
    rarity: raw.rarete,
    category,
    icon: CATEGORY_ICONS[category],
    assetUrl: raw.url_asset === null ? null : `/items/${id}.webp`,
    pieceIds: [],
  };
}

/** Links each bundle of a season to the regular items it groups. */
function withBundlePieces(items: readonly LotteryItem[]): LotteryItem[] {
  const pieceIds = items
    .filter((item) => item.category !== "Panoplie")
    .map((item) => item.id);
  return items.map((item) =>
    item.category === "Panoplie" ? { ...item, pieceIds } : item,
  );
}

export const SEASONS: readonly Season[] = lottery.saisons.map((raw) => {
  const id = slugify(raw.saison);
  return {
    id,
    name: raw.saison,
    period: raw.periode,
    accent: SEASON_ACCENTS[id] ?? DEFAULT_ACCENT,
    isUpcoming: raw.items.length === 0,
    items: withBundlePieces(
      raw.items.map((item) => toItem(item, id, raw.saison)),
    ),
  };
});

export const ITEMS: readonly LotteryItem[] = SEASONS.flatMap(
  (season) => season.items,
);

/** Items that carry their own obtained state (bundles are derived). */
export const PIECES: readonly LotteryItem[] = ITEMS.filter(
  (item) => item.pieceIds.length === 0,
);

export function isBundle(item: LotteryItem) {
  return item.pieceIds.length > 0;
}

export const LOTTERY_SOURCE_URL = lottery.source;
