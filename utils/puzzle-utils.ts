import type {
  Puzzle,
  PuzzleTheme} from "@/__generated/puzzles";
import {
  PUZZLE_THEMES,
  PUZZLES
} from "@/__generated/puzzles";

export function getPuzzleThemes(): ReadonlyArray<PuzzleTheme> {
  return PUZZLE_THEMES as ReadonlyArray<PuzzleTheme>;
}

export function getPuzzles(): ReadonlyArray<Puzzle> {
  return PUZZLES as ReadonlyArray<Puzzle>;
}

export function filterPuzzlesByTheme(
  puzzles: ReadonlyArray<Puzzle>,
  themeId: string,
): ReadonlyArray<Puzzle> {
  return puzzles.filter((puzzle) => {
    const themes = puzzle.themes.split(" ");
    return themes.includes(themeId);
  });
}

export function getRandomPuzzle(puzzles: ReadonlyArray<Puzzle>): Puzzle | null {
  if (puzzles.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex] || null;
}
