"use client";

import type { Square } from "chess.js";
import { Chess } from "chess.js";
import { useCallback, useState } from "react";

import { parsePgnMoves } from "@/utils/string-utils";

import { useMoveHistory } from "./use-move-history";

const PGN_OPTIONS = { maxWidth: 80, newline: "\n" } as const;

export const useChessGame = () => {
  const [chess] = useState(() => new Chess());
  const [moveHistory, setMoveHistory] = useState<
    Array<{ from: string; to: string; promotion?: string }>
  >([]);

  const [fen, setFen] = useState(chess.fen());
  const [pgn, setPgn] = useState(chess.pgn(PGN_OPTIONS));
  const [isCheck, setIsCheck] = useState(chess.inCheck());
  const [isGameOver, setIsGameOver] = useState(chess.isGameOver());
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [fenHistory, setFenHistory] = useState<string[]>([chess.fen()]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1); // -1 means at the latest position

  const { clearRedo, pushUndo, popRedo, hasRedoMoves } = useMoveHistory();

  const getGameOverReason = (): string | null => {
    if (chess.isCheckmate()) return "Checkmate";
    if (chess.isStalemate()) return "Draw, Stalemate";
    if (chess.isThreefoldRepetition()) return "Draw, Threefold Repetition";
    if (chess.isInsufficientMaterial()) return "Draw, Insufficient Material";
    return null;
  };

  const updateGameState = () => {
    const newFen = chess.fen();
    setFen(newFen);
    setPgn(chess.pgn(PGN_OPTIONS));
    setIsCheck(chess.inCheck());
    setIsGameOver(chess.isGameOver());
    setGameOverReason(getGameOverReason());
    return newFen;
  };

  const makeMove = (orig: string, dest: string, promotion?: string) => {
    // If viewing a historical position, truncate history from current position
    if (currentMoveIndex >= 0) {
      chess.reset();
      const newHistory = moveHistory.slice(0, currentMoveIndex + 1);
      for (const move of newHistory) {
        chess.move(move);
      }
      setMoveHistory(newHistory);
      setFenHistory((prev) => prev.slice(0, currentMoveIndex + 2));
    }

    const move = chess.move({ from: orig, to: dest, promotion });
    if (move) {
      const newFen = updateGameState();
      clearRedo();
      setMoveHistory((prev) => [
        ...prev,
        { from: move.from, to: move.to, promotion: move.promotion },
      ]);
      setFenHistory((prev) => [...prev, newFen]);
      setCurrentMoveIndex(-1);
      return true;
    }
    return false;
  };

  const getDests = () => {
    const dests = new Map<Square, Square[]>();
    chess.moves({ verbose: true }).forEach((move) => {
      if (!dests.has(move.from)) dests.set(move.from, []);
      dests.get(move.from)?.push(move.to);
    });
    return dests;
  };

  const reset = () => {
    chess.reset();
    const initialFen = updateGameState();
    clearRedo();
    setMoveHistory([]);
    setFenHistory([initialFen]);
    setCurrentMoveIndex(-1);
  };

  const loadFromPgn = useCallback((pgnString: string) => {
    try {
      chess.reset();
      const moves = parsePgnMoves(pgnString.trim());

      const fenHistoryTemp = [chess.fen()];
      const moveHistoryTemp: Array<{
        from: string;
        to: string;
        promotion?: string;
      }> = [];

      for (const move of moves) {
        const result = chess.move(move);
        if (!result) {
          console.error("Invalid move in PGN:", move);
          return false;
        }
        moveHistoryTemp.push({
          from: result.from,
          to: result.to,
          promotion: result.promotion,
        });
        fenHistoryTemp.push(chess.fen());
      }

      updateGameState();
      clearRedo();
      setCurrentMoveIndex(-1);
      setMoveHistory(moveHistoryTemp);
      setFenHistory(fenHistoryTemp);
      return true;
    } catch (e) {
      console.error("Invalid PGN:", e);
      return false;
    }
  }, []);

  const turnColor = chess.turn() === "w" ? "white" : "black";
  const getCheck = () => isCheck;

  const undo = () => {
    const newIndex =
      currentMoveIndex === -1 ? moveHistory.length - 2 : currentMoveIndex - 1;

    if (newIndex < -1) return false;

    if (newIndex === -1) {
      // Go back to initial position
      chess.reset();
      setCurrentMoveIndex(-1);
      setFen(chess.fen());
      setIsCheck(chess.inCheck());
    } else {
      // Navigate to previous position
      chess.reset();
      for (let i = 0; i <= newIndex; i++) {
        chess.move(moveHistory[i]);
      }
      setCurrentMoveIndex(newIndex);
      setFen(chess.fen());
      setIsCheck(chess.inCheck());
    }
    return true;
  };

  const canUndo = () => {
    if (currentMoveIndex === -1) {
      return moveHistory.length > 0;
    }
    return currentMoveIndex >= 0;
  };

  const redo = () => {
    const newIndex = currentMoveIndex + 1;

    if (newIndex >= moveHistory.length) return false;

    // Navigate to next position
    chess.reset();
    for (let i = 0; i <= newIndex; i++) {
      chess.move(moveHistory[i]);
    }

    // If we're at the last move, set index to -1
    if (newIndex === moveHistory.length - 1) {
      setCurrentMoveIndex(-1);
    } else {
      setCurrentMoveIndex(newIndex);
    }

    setFen(chess.fen());
    setIsCheck(chess.inCheck());
    return true;
  };

  const canRedo = () => {
    if (currentMoveIndex === -1) return false;
    return currentMoveIndex < moveHistory.length - 1;
  };

  const goToMoveIndex = (moveIndex: number) => {
    if (moveIndex < -1 || moveIndex >= moveHistory.length) return;

    if (moveIndex === -1) {
      // Go to initial position
      chess.reset();
      setCurrentMoveIndex(-1);
      setFen(chess.fen());
      setIsCheck(chess.inCheck());
      return;
    }

    // Navigate to the position without modifying the history
    setCurrentMoveIndex(moveIndex);

    // Update Chess instance to the selected position
    chess.reset();
    for (let i = 0; i <= moveIndex; i++) {
      chess.move(moveHistory[i]);
    }

    // Update display state (but keep full PGN)
    setFen(chess.fen());
    setIsCheck(chess.inCheck());
  };

  // Adapter function to match Chessground's move event signature
  const handleChessgroundMove = (orig: string, dest: string) => {
    // Check if this is a pawn promotion move
    const piece = chess.get(orig as Square);
    let promotion: string | undefined;

    if (piece && piece.type === "p" && (dest[1] === "8" || dest[1] === "1")) {
      // For now, default to queen promotion
      // In the future, this could be enhanced with a promotion dialog
      promotion = "q";
    }

    makeMove(orig, dest, promotion);
  };

  return {
    fen,
    pgn,
    move: handleChessgroundMove,
    getDests,
    turnColor: turnColor as "white" | "black",
    getCheck,
    isGameOver,
    gameOverReason,
    reset,
    currentMoveIndex,
    loadFromPgn,
    fenHistory,
    undo,
    canUndo,
    redo,
    canRedo,
    goToMoveIndex,
  };
};
