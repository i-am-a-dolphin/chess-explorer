"use client";

import { useLocalStorage } from "@mantine/hooks";

const STORAGE_KEY = "chessground-orientation";

type ChessgroundOrientation = "white" | "black";

export const useChessgroundOrientation = (
  initialOrientation: ChessgroundOrientation = "white",
) => {
  const [chessgroundOrientation, setChessgroundOrientation] =
    useLocalStorage<ChessgroundOrientation>({
      key: STORAGE_KEY,
      defaultValue: initialOrientation,
    });

  const toggleChessgroundOrientation = () => {
    setChessgroundOrientation((prev) => (prev !== "white" ? "white" : "black"));
  };
  return { chessgroundOrientation, toggleChessgroundOrientation };
};
