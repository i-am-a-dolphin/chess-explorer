"use client";

import { Chess } from "chess.js";
import {
  CaptionsIcon,
  CaptionsOffIcon,
  EyeIcon,
  EyeOffIcon,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { PUZZLE_THEMES } from "@/__generated/puzzles";
import { MoveButton } from "@/components/move-button";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { ButtonGroup } from "@/components/shadcn-ui/button-group";
import { useLocalizedTheme } from "@/hooks/use-localized-theme";
import type { LichessPuzzleResponse } from "@/services/lichess-puzzles/lichess-puzzle.types";
import { isUciMove } from "@/utils/move-utils";
import {
  extractPromotionPiece,
  extractUciSquares,
  parsePgnMoves,
} from "@/utils/string-utils";

type PuzzleInfoProps = {
  puzzle: LichessPuzzleResponse;
  makeMove: (orig: string, dest: string, promotion?: string) => void;
  currentPgn: string;
  loadFromPgn: (pgn: string) => void;
  onPreviewMoveChange?: (uci: string | null) => void;
};

export const PuzzleInfo = ({
  puzzle,
  makeMove,
  currentPgn,
  loadFromPgn,
  onPreviewMoveChange,
}: PuzzleInfoProps) => {
  const t = useTranslations("chess");
  const { getThemeLabel } = useLocalizedTheme();
  const [showSolution, setShowSolution] = useState(false);
  const [showThemes, setShowThemes] = useState(false);

  const { game, puzzle: puzzleData } = puzzle;

  // UCI solution을 SAN으로 변환
  const solutionInSan = useMemo(() => {
    try {
      const chess = new Chess();
      chess.loadPgn(game.pgn);

      return puzzleData.solution.map((uci) => {
        const { origin, destination } = extractUciSquares(uci);
        const promotion = extractPromotionPiece(uci);
        const move = chess.move({ from: origin, to: destination, promotion });
        return move ? move.san : uci;
      });
    } catch (error) {
      console.error("Failed to convert UCI to SAN:", error);
      return puzzleData.solution;
    }
  }, [game.pgn, puzzleData.solution]);

  // 초기 게임의 마지막 턴 색을 계산
  const initialTurnColor = useMemo(() => {
    try {
      const chess = new Chess();
      chess.loadPgn(game.pgn);
      return chess.turn() === "w" ? "white" : "black";
    } catch {
      return "white";
    }
  }, [game.pgn]);

  // 현재 pgn과 초기 pgn을 비교하여 추가된 수의 개수를 계산
  const initialMoves = parsePgnMoves(game.pgn.trim());
  const currentMoves = parsePgnMoves(currentPgn.trim());
  const additionalMoves = currentMoves.length - initialMoves.length;

  // 초기 pgn의 모든 수가 현재 pgn에 그대로 있는지 확인
  const isPgnModified = !initialMoves.every(
    (move, index) => currentMoves[index] === move,
  );
  const activeSolutionIndex = isPgnModified ? -1 : additionalMoves;

  const getThemeLabelText = (theme: string) => {
    const themeObj = PUZZLE_THEMES.find((t) => t.theme === theme);
    if (!themeObj) return theme;
    return getThemeLabel(themeObj);
  };

  const handleSolutionMoveClick = (uci: string) => {
    if (!isUciMove(uci)) return;
    const { origin, destination } = extractUciSquares(uci);
    const promotion = extractPromotionPiece(uci);
    makeMove(origin, destination, promotion);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("puzzleInfo")}</h3>
        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadFromPgn(game.pgn)}
            title={t("resetPuzzle")}
            disabled={!isPgnModified && additionalMoves === 0}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowThemes(!showThemes)}
            title={showThemes ? t("hideThemes") : t("showThemes")}
          >
            {showThemes ? (
              <CaptionsOffIcon className="h-4 w-4" />
            ) : (
              <CaptionsIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSolution(!showSolution)}
            title={showSolution ? t("hideSolution") : t("showSolution")}
          >
            {showSolution ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`https://lichess.org/training/${puzzle.puzzle.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lichess ↗
            </Link>
          </Button>
        </ButtonGroup>
      </div>

      {/* Players */}
      <div className="space-y-3">
        <div>
          <h4 className="text-muted-foreground mb-2 text-xs font-medium">
            {t("players")}
          </h4>
          <div className="space-y-1 text-sm">
            {game.players.map((player) => (
              <div key={player.id} className="flex items-baseline gap-1">
                <span>{player.color === "white" ? "⚪" : "⚫"}</span>
                {player.title && (
                  <span className="font-bold">{player.title}</span>
                )}
                <span className="font-medium">
                  <span>{player.name}</span>
                </span>
                <span className="text-muted-foreground text-2xs">
                  {player.rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Game Type & Rating with Themes */}
        {showThemes && (
          <div className="space-y-3">
            <div>
              <h4 className="text-muted-foreground mb-2 text-xs font-medium">
                {t("gameType")}
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {t(`gameTypes.${game.perf.key}`)}
                  {game.clock && ` • ${game.clock}`}
                </Badge>
                <Badge variant="secondary">
                  {t("rating")} {puzzleData.rating} {t("level")}
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-2 text-xs font-medium">
                {t("themes")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {puzzleData.themes.map((theme) => (
                  <Badge key={theme} variant="outline">
                    {getThemeLabelText(theme)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div>
            <h4 className="text-muted-foreground mb-2 text-xs font-medium">
              {t("solution")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {puzzleData.solution.map((uci, index) => {
                const isActive = index === activeSolutionIndex;
                const turnColor =
                  index % 2 === 0
                    ? initialTurnColor
                    : initialTurnColor === "white"
                      ? "black"
                      : "white";

                return (
                  <div
                    key={`${uci}-${index}`}
                    className={!isActive ? "opacity-50" : ""}
                  >
                    <MoveButton
                      move={solutionInSan[index]}
                      turnColor={turnColor}
                      uci={uci}
                      onClick={() => isActive && handleSolutionMoveClick(uci)}
                      onPreviewMoveChange={onPreviewMoveChange}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
