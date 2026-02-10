import { Chess } from "chess.js";
import { parseFen } from "chessops/fen";

import { FEN_TO_IMAGE_BASE } from "@/services/endpoint.constant";
import type { LichessTablebaseOutcome } from "@/services/lichess-tablebase/lichess-tablebase.types";
import type { ChessPhase, Fen, Pgn, Turn, TurnColor } from "@/types/core";
import { getUrl } from "@/utils/url-utils";

const PIECE_VALUES: Record<string, number> = {
  K: Infinity,
  Q: 9,
  R: 5,
  B: 3.01,
  N: 3,
  P: 1,
} as const;

export const getPieceValue = (san: string): number => {
  const firstChar = san.charAt(0);
  return PIECE_VALUES[firstChar] || PIECE_VALUES["P"];
};

export const sortSquare = (square: string): number => {
  const file = square.charCodeAt(0) - "a".charCodeAt(0);
  const rank = parseInt(square[1]) - 1;
  return file * 8 + rank;
};

export const convertTurnToTurnColor = (turn: Turn): TurnColor => {
  switch (turn) {
    case "w":
      return "white";
    case "b":
      return "black";
  }
};

export const getTurnColorFromFen = (fen: Fen): TurnColor => {
  const chess = new Chess(fen);
  return convertTurnToTurnColor(chess.turn());
};

export const getTablebaseOutcomeLabelKey = (
  category: LichessTablebaseOutcome,
  turnColor: TurnColor,
): string => {
  const normalized = category.toLowerCase();

  if (normalized.includes("draw")) return "resultDraw";
  if (normalized.includes("win") || normalized.includes("loss")) {
    const sideToMoveWins = normalized.includes("win");
    const winnerColor = sideToMoveWins
      ? turnColor
      : turnColor === "white"
        ? "black"
        : "white";
    return winnerColor === "white" ? "resultWhiteWin" : "resultBlackWin";
  }

  return "tablebaseOutcome.unknown";
};

export const getTurnColorFromPgn = (pgn: Pgn): TurnColor => {
  const chess = new Chess();
  chess.loadPgn(pgn);
  return convertTurnToTurnColor(chess.turn());
};

export const convertPgnToFen = (pgn: Pgn): Fen => {
  const chess = new Chess();
  chess.loadPgn(pgn);
  return chess.fen() as Fen;
};

export const getChessPhase = (
  pieceCount: number,
  hasNextMoves: boolean,
): ChessPhase => {
  if (pieceCount <= 8) return "endgame";
  if (hasNextMoves) return "opening";
  return "middlegame";
};

export const fenToEpd = (fen: string) => {
  return fen.split(" ").slice(0, -2).join(" ");
};

export const getPieceUnicode = (san: string, turnColor: TurnColor): string => {
  switch (san.charAt(0)) {
    case "K":
      return turnColor === "white" ? "♔" : "♚";
    case "Q":
      return turnColor === "white" ? "♕" : "♛";
    case "R":
      return turnColor === "white" ? "♖" : "♜";
    case "B":
      return turnColor === "white" ? "♗" : "♝";
    case "N":
      return turnColor === "white" ? "♘" : "♞";
    default:
      return turnColor === "white" ? "♙" : "♟";
  }
};

export const getBoardImageUrl = (
  fen: string,
  chessgroundOrientation: "white" | "black",
): string => {
  const turn = parseFen(fen).unwrap().turn;
  const url = getUrl(FEN_TO_IMAGE_BASE, {
    pathname: fen,
    searchParams: {
      turn,
      pov: chessgroundOrientation,
    },
  });
  return url.toString();
};
