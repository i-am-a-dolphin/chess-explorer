"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { PuzzleTheme } from "@/__generated/puzzles";
import { useLocalizedTheme } from "@/hooks/use-localized-theme";
import type { LichessPuzzleResponse } from "@/services/lichess-puzzles/lichess-puzzle.types";
import { useLichessPuzzleByIdQuery } from "@/services/lichess-puzzles/use-lichess-puzzle.query";
import {
  filterPuzzlesByTheme,
  getPuzzles,
  getRandomPuzzle,
} from "@/utils/puzzle-utils";

interface UsePuzzleResult {
  puzzle: LichessPuzzleResponse | null;
  loading: boolean;
  error: string | null;
  loadNewPuzzle: (theme: PuzzleTheme) => Promise<void>;
  clearPuzzle: () => void;
  currentTheme: PuzzleTheme | null;
}

export function usePuzzle(): UsePuzzleResult {
  const [puzzle, setPuzzle] = useState<LichessPuzzleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<PuzzleTheme | null>(null);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string | null>(null);
  const { getThemeLabel } = useLocalizedTheme();
  const allPuzzles = useMemo(() => getPuzzles(), []);
  const puzzleQuery = useLichessPuzzleByIdQuery(selectedPuzzleId);

  useEffect(() => {
    if (!selectedPuzzleId) return;

    if (puzzleQuery.error) {
      setError(puzzleQuery.error.message || "퍼즐을 불러오는데 실패했습니다.");
      setLoading(false);
      return;
    }

    if (puzzleQuery.data) {
      setPuzzle(puzzleQuery.data);
      setLoading(false);
    }
  }, [puzzleQuery.data, puzzleQuery.error, selectedPuzzleId]);

  const loadNewPuzzle = useCallback(
    async (theme: PuzzleTheme) => {
      if (allPuzzles.length === 0) {
        setError("퍼즐 데이터가 없습니다.");
        setPuzzle(null);
        return;
      }

      setLoading(true);
      setError(null);
      setPuzzle(null);
      setCurrentTheme(theme);

      try {
        // 선택한 테마의 퍼즐 필터링
        const filteredPuzzles = filterPuzzlesByTheme(allPuzzles, theme.id);

        if (filteredPuzzles.length === 0) {
          setError(
            `"${getThemeLabel(theme)}" 테마에 해당하는 퍼즐이 없습니다.`,
          );
          setLoading(false);
          return;
        }

        // 랜덤 퍼즐 선택
        const randomPuzzle = getRandomPuzzle(filteredPuzzles);

        if (!randomPuzzle) {
          setError("퍼즐을 선택할 수 없습니다.");
          setLoading(false);
          return;
        }

        // Lichess API에서 상세 정보 가져오기
        setSelectedPuzzleId(randomPuzzle.puzzleId);
      } catch (err) {
        console.error("Failed to load puzzle:", err);
        setError("퍼즐을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [allPuzzles, getThemeLabel],
  );

  const clearPuzzle = useCallback(() => {
    setPuzzle(null);
    setError(null);
    setLoading(false);
    setCurrentTheme(null);
    setSelectedPuzzleId(null);
  }, []);

  return {
    puzzle,
    loading,
    error,
    loadNewPuzzle,
    clearPuzzle,
    currentTheme,
  };
}
