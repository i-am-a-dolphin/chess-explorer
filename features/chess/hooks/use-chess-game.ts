"use client";

import type { Square } from "chess.js";
import { Chess } from "chess.js";
import { useCallback, useState } from "react";

import { parsePgnMoves } from "@/utils/string-utils";

import { useMoveHistory } from "./use-move-history";

const PGN_OPTIONS = { maxWidth: 80, newline: "\n" } as const;

export const useChessGame = () => {
  const [chess] = useState(() => new Chess());

  const [fen, setFen] = useState(chess.fen());
  const [pgn, setPgn] = useState(chess.pgn(PGN_OPTIONS));
  const [isCheck, setIsCheck] = useState(chess.inCheck());
  const [isGameOver, setIsGameOver] = useState(chess.isGameOver());
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [fenHistory, setFenHistory] = useState<string[]>([chess.fen()]);

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
    const move = chess.move({ from: orig, to: dest, promotion });
    if (move) {
      const newFen = updateGameState();
      clearRedo();
      setFenHistory((prev) => [...prev, newFen]);
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
    setFenHistory([initialFen]);
  };

  const loadFromPgn = useCallback((pgnString: string) => {
    try {
      chess.reset();
      const moves = parsePgnMoves(pgnString.trim());

      const fenHistoryTemp = [chess.fen()];
      for (const move of moves) {
        const result = chess.move(move);
        if (!result) {
          console.error("Invalid move in PGN:", move);
          return false;
        }
        fenHistoryTemp.push(chess.fen());
      }

      updateGameState();
      clearRedo();
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
    const move = chess.undo();
    if (move) {
      pushUndo({ from: move.from, to: move.to, promotion: move.promotion });
      updateGameState();
      setFenHistory((prev) => prev.slice(0, -1));
      return true;
    }
    return false;
  };

  const canUndo = () => chess.history().length > 0;

  const redo = () => {
    if (!hasRedoMoves()) return false;

    const lastMove = popRedo();
    const move = chess.move({
      from: lastMove.from,
      to: lastMove.to,
      promotion: lastMove.promotion,
    });

    if (move) {
      const newFen = updateGameState();
      setFenHistory((prev) => [...prev, newFen]);
      return true;
    }
    return false;
  };

  const canRedo = () => hasRedoMoves();

  const goToMoveIndex = (moveIndex: number) => {
    const history = chess.history({ verbose: true });

    if (moveIndex < 0 || moveIndex >= history.length) return;

    chess.reset();
    const newFenHistory = [chess.fen()];
    for (let i = 0; i <= moveIndex; i++) {
      chess.move({
        from: history[i].from,
        to: history[i].to,
        promotion: history[i].promotion,
      });
      newFenHistory.push(chess.fen());
    }

    updateGameState();
    clearRedo();
    setFenHistory(newFenHistory);
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
    loadFromPgn,
    fenHistory,
    undo,
    canUndo,
    redo,
    canRedo,
    goToMoveIndex,
  };
};
