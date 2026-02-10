"use client";

import { useState } from "react";

type MoveStackItem = { from: string; to: string; promotion?: string };

export const useMoveHistory = () => {
  const [redoStack, setRedoStack] = useState<MoveStackItem[]>([]);

  const clearRedo = () => {
    setRedoStack([]);
  };

  const pushUndo = (move: MoveStackItem) => {
    setRedoStack((prev) => [...prev, move]);
  };

  const popRedo = () => {
    const lastMove = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    return lastMove;
  };

  const hasRedoMoves = () => redoStack.length > 0;

  return {
    redoStack,
    clearRedo,
    pushUndo,
    popRedo,
    hasRedoMoves,
  };
};
