import type { Opening } from "@/__generated/openings";

import type { San, Uci } from "./core";

export type NextOpeningMove = {
  uci: Uci;
  san: San;
  openings: Array<Opening & { moveCount: number }>;
  orig: string;
  dest: string;
  pieceValue: number;
};
