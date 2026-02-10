"use client";

import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@lichess-org/chessground/assets/chessground.cburnett.css";

import type { HeadlessState } from "@lichess-org/chessground/state";
import { useEffect } from "react";

import { useChessground } from "@/features/chessground/hooks/use-chessground";
import { parseUciMove } from "@/utils/move-utils";

import { GameOverDialog } from "./game-over-dialog";

type ChessgroundProps = {
  fen: string;
  turnColor: "white" | "black";
  isGameOver: boolean;
  gameOverReason?: string | null;
  onRestart: () => void;
  getDests: () => Map<string, string[]>;
  getCheck: () => boolean;
  move: HeadlessState["events"]["move"];
  previewMove: string | null;
};

export const Chessground = ({
  fen,
  turnColor,
  isGameOver,
  gameOverReason,
  onRestart,
  getDests,
  getCheck,
  move,
  previewMove,
}: ChessgroundProps) => {
  const { chessground, ref } = useChessground({
    fen,
    movable: {
      free: false,
      color: isGameOver ? undefined : turnColor,
      dests: isGameOver ? new Map() : getDests(),
    },
    events: {
      move,
    },
  });

  useEffect(() => {
    if (chessground) {
      const baseConfig = {
        fen,
        turnColor,
        check: getCheck(),
        movable: {
          color: isGameOver ? undefined : turnColor,
          dests: isGameOver ? new Map() : getDests(),
        },
      };

      const parsedMove = parseUciMove(previewMove || "");

      if (parsedMove !== null) {
        const { orig, dest } = parsedMove;
        chessground.set({
          ...baseConfig,
          drawable: {
            enabled: true,
            visible: true,
            autoShapes: [
              {
                orig,
                dest,
                brush: "grey",
              },
            ],
          },
        });
      } else {
        chessground.set({
          ...baseConfig,
          drawable: {
            enabled: true,
            visible: true,
            autoShapes: [],
          },
        });
      }
    }
  }, [
    fen,
    chessground,
    turnColor,
    getDests,
    getCheck,
    isGameOver,
    previewMove,
  ]);

  return (
    <div className="relative w-full max-w-lg space-y-2">
      <div ref={ref} className="aspect-square" />
      <GameOverDialog
        isGameOver={isGameOver}
        gameOverReason={gameOverReason}
        onRestart={onRestart}
      />
    </div>
  );
};
