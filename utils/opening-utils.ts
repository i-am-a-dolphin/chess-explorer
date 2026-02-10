import type { Game, PgnNodeData } from "chessops/pgn";
import { parsePgn } from "chessops/pgn";

import type { Opening} from "@/__generated/openings";
import { OPENINGS } from "@/__generated/openings";
import type { Epd, Pgn, San, Uci } from "@/types/core";
import type { NextOpeningMove } from "@/types/openings";
import { getPieceValue } from "@/utils/chess-utils";
import { getUciMoveAt, sortMovesByPieceAndSquare } from "@/utils/move-utils";

export const parseSinglePgn = (pgn: string): Game<PgnNodeData> | null => {
  const parsed = parsePgn(pgn);
  return parsed.length === 1 ? parsed[0] : null;
};

export const getNextOpeningMoves = (pgn: string): NextOpeningMove[] => {
  const game = parseSinglePgn(pgn);

  if (!game) {
    return [];
  }

  const currentMoves = Array.from(game.moves.mainline());
  const currentMoveCount = currentMoves.length;

  const movesMap = new Map<string, Opening[]>();

  OPENINGS.forEach((opening) => {
    const openingGame = parseSinglePgn(opening.pgn);
    if (!openingGame) return;

    const openingMoves = Array.from(openingGame.moves.mainline());

    if (openingMoves.length <= currentMoveCount) return;

    let matches = true;
    for (let i = 0; i < currentMoveCount; i++) {
      if (currentMoves[i].san !== openingMoves[i].san) {
        matches = false;
        break;
      }
    }

    if (matches) {
      const nextMove = openingMoves[currentMoveCount];
      if (nextMove) {
        const san = nextMove.san;
        if (!movesMap.has(san)) {
          movesMap.set(san, []);
        }
        movesMap.get(san)!.push({
          eco: opening.eco,
          name: opening.name,
          name_ko: opening.name_ko,
          uci: opening.uci as Uci,
          pgn: opening.pgn as Pgn,
          epd: opening.epd as Epd,
          moveCount: opening.moveCount,
        });
      }
    }
  });

  const moveItems = Array.from(movesMap.entries()).map(([move, openings]) => {
    const nameMap = new Map<string, Opening[]>();
    openings.forEach((opening) => {
      if (!nameMap.has(opening.name)) {
        nameMap.set(opening.name, []);
      }
      nameMap.get(opening.name)!.push(opening);
    });

    const uniqueOpenings = Array.from(nameMap.values()).map((group) => {
      const shortest = group.reduce((shortest, current) =>
        current.pgn.length < shortest.pgn.length ? current : shortest,
      );
      const shortestParsed = parsePgn(shortest.pgn);
      const shortestMoves =
        shortestParsed.length > 0
          ? Array.from(shortestParsed[0].moves.mainline())
          : [];
      const moveCount = shortestMoves.length - currentMoveCount;
      return { ...shortest, moveCount: Math.max(0, moveCount) };
    });

    const firstOpening = openings[0];
    const nextMove = getUciMoveAt(firstOpening.uci, currentMoveCount);

    return {
      uci: nextMove.uci,
      san: move as San,
      openings: uniqueOpenings,
      orig: nextMove.orig,
      dest: nextMove.dest,
      pieceValue: getPieceValue(move),
    };
  });

  return sortMovesByPieceAndSquare(moveItems);
};
