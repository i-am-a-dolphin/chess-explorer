import type { Key } from "@lichess-org/chessground/types";
import type { Chess } from "chess.js";

import type { Uci } from "@/types/core";

import { getPieceUnicode, getPieceValue, sortSquare } from "./chess-utils";
import {
  extractPromotionPiece,
  extractUciDestination,
  extractUciOrigin,
} from "./string-utils";

export interface MoveItem {
  uci: Uci;
  san: string;
}

export const isUciMove = (uci: string): uci is Uci => {
  return /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci);
};

export const splitUciMoves = (uci: string): Uci[] => {
  return uci.trim().split(/\s+/).filter(isUciMove);
};

export const getUciMoveAt = (uci: string, index: number) => {
  const moves = splitUciMoves(uci);
  const target = moves[index];
  if (!target) {
    return { uci: "" as Uci, orig: "", dest: "" };
  }
  const parsed = parseUciMove(target);
  return { uci: target, orig: parsed?.orig ?? "", dest: parsed?.dest ?? "" };
};

export const parseUciMove = (uci: Uci | string) => {
  if (!isUciMove(uci)) {
    return null;
  }

  return {
    orig: extractUciOrigin(uci) as Key,
    dest: extractUciDestination(uci) as Key,
  };
};

export const getUciSanLabel = (chess: Chess, uci: string): string => {
  if (!isUciMove(uci)) {
    return uci;
  }

  const parsed = parseUciMove(uci);
  if (parsed === null) {
    return uci;
  }

  const { orig, dest } = parsed;
  const promotion = extractPromotionPiece(uci);
  const move = chess.move({ from: orig, to: dest, promotion });
  if (!move) {
    return uci;
  }

  const turnColor = move.color === "w" ? "white" : "black";
  const symbol = getPieceUnicode(move.san, turnColor);
  return `${symbol} ${move.san}`.trim();
};

export const lanToUci = (lan: string): Uci | null => {
  if (isUciMove(lan)) {
    return lan as Uci;
  }
  return null;
};

export const sortMovesByPieceAndSquare = <T extends MoveItem>(
  moves: T[],
): T[] => {
  return [...moves].sort((a, b) => {
    const pieceCompare = getPieceValue(a.san) - getPieceValue(b.san);
    if (pieceCompare !== 0) return pieceCompare;

    const aParsed = parseUciMove(a.uci);
    const bParsed = parseUciMove(b.uci);
    const aOrig = aParsed?.orig ?? "";
    const bOrig = bParsed?.orig ?? "";
    const origCompare = sortSquare(aOrig) - sortSquare(bOrig);
    if (origCompare !== 0) return origCompare;

    const aDest = aParsed?.dest ?? "";
    const bDest = bParsed?.dest ?? "";
    return sortSquare(aDest) - sortSquare(bDest);
  });
};
