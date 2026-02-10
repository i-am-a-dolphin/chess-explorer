import type { San, Turn, Uci } from "@/types/core";

export type LichessTablebaseOutcome =
  | "win"
  | "syzygy-win"
  | "maybe-win"
  | "cursed-win"
  | "draw"
  | "loss"
  | "syzygy-loss"
  | "maybe-loss"
  | "blessed-loss"
  | "unknown";

export type LichessTablebaseStandardMove = {
  uci: Uci;
  san: San;
  dtz: number | null;
  precise_dtz: number | null;
  dtm: number | null;
  category: LichessTablebaseOutcome;
};

// https://tablebase.lichess.ovh/standard
export type LichessTablebaseStandardResponse = {
  dtz: number | null;
  precise_dtz: number | null;
  dtc: number | null;
  dtm: number | null;
  dtw: number | null;
  checkmate: boolean;
  stalemate: boolean;
  variant_win: boolean;
  variant_loss: boolean;
  insufficient_material: boolean;
  category: LichessTablebaseOutcome;
  moves: LichessTablebaseStandardMove[];
};

export type LichessTablebaseMainlineMove = {
  uci: Uci;
  san: San;
  dtz: number | null;
};

// https://tablebase.lichess.ovh/standard/mainline
export type LichessTablebaseMainlineResponse = {
  dtz: number | null;
  mainline: LichessTablebaseMainlineMove[];
  winner: Turn | null;
};
