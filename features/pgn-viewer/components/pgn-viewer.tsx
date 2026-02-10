"use client";

import type { HeadlessState } from "@lichess-org/chessground/state";

import { Chessground } from "@/features/chessground/components/chessground";

import { FenInfo } from "./board-info";
import { ControlButtons } from "./control-buttons";
import { MoveHistoryTable } from "./move-history-table";

type PgnViewerProps = {
  fen: string;
  pgn: string;
  turnColor: "white" | "black";
  getCheck: () => boolean;
  previewMove: string | null;
  isGameOver: boolean;
  getDests: () => Map<string, string[]>;
  move: HeadlessState["events"]["move"];
  gameOverReason?: string | null;
  reset: () => void;
  undo: () => boolean;
  canUndo: () => boolean;
  redo: () => boolean;
  canRedo: () => boolean;
  goToMoveIndex: (moveIndex: number) => void;
  currentMoveIndex: number;
};

export const PgnViewer = ({
  fen,
  pgn,
  turnColor,
  getCheck,
  isGameOver,
  previewMove,
  getDests,
  move,
  gameOverReason,
  reset,
  undo,
  canUndo,
  redo,
  canRedo,
  goToMoveIndex,
  currentMoveIndex,
}: PgnViewerProps) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <MoveHistoryTable pgn={pgn} goToMoveIndex={goToMoveIndex} currentMoveIndex={currentMoveIndex} />
      <div className="flex flex-1 flex-col items-center gap-4 lg:order-2">
        <Chessground
          fen={fen}
          turnColor={turnColor}
          isGameOver={isGameOver}
          gameOverReason={gameOverReason}
          onRestart={reset}
          getDests={getDests}
          getCheck={getCheck}
          move={move}
          previewMove={previewMove}
        />
        <FenInfo fen={fen} />
        <ControlButtons
          canUndo={canUndo()}
          canRedo={canRedo()}
          onUndo={undo}
          onRedo={redo}
          onReset={reset}
        />
      </div>
    </div>
  );
};
