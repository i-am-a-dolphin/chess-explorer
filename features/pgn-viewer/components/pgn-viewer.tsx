"use client";

import type { HeadlessState } from "@lichess-org/chessground/state";

import { Chessground } from "@/features/chessground/components/chessground";

import { BoardInfo } from "./board-info";
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
}: PgnViewerProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
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
      <BoardInfo fen={fen} turnColor={turnColor} />
      <ControlButtons
        canUndo={canUndo()}
        canRedo={canRedo()}
        onUndo={undo}
        onRedo={redo}
        onReset={reset}
      />
      <MoveHistoryTable pgn={pgn} goToMoveIndex={goToMoveIndex} />
    </div>
  );
};
