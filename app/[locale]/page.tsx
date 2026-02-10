"use client";

import { parseFen } from "chessops/fen";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import type { Opening } from "@/__generated/openings";
import type { PuzzleTheme } from "@/__generated/puzzles";
import { GameInfo } from "@/components/game-info";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import { useChessGame } from "@/features/chess/hooks/use-chess-game";
import { OpeningTree } from "@/features/opening-tree/components/opening-tree";
import { PgnViewer } from "@/features/pgn-viewer/components/pgn-viewer";
import { PuzzleInfo } from "@/features/puzzle-info/components/puzzle-info";
import { SearchOpeningCommand } from "@/features/search-opening/search-opening-command";
import { SearchPuzzleCommand } from "@/features/search-puzzle/search-puzzle-command";
import { usePuzzle } from "@/hooks/use-puzzle";
import { getChessPhase } from "@/utils/chess-utils";
import { getNextOpeningMoves } from "@/utils/opening-utils";

const HomePage = () => {
  const chessGame = useChessGame();
  const t = useTranslations("chess");
  const { pgn, fen, fenHistory, loadFromPgn, goToMoveIndex } = chessGame;
  const [previewMove, setPreviewMove] = useState<string | null>(null);
  const [_, setSelectedTheme] = useState<PuzzleTheme | null>(null);
  const { puzzle, loading, error, loadNewPuzzle } = usePuzzle();

  const nextOpeningMoves = useMemo(() => getNextOpeningMoves(pgn), [pgn]);
  const pieceCount = useMemo(
    () => parseFen(fen).unwrap().board.occupied.size(),
    [fen],
  );
  const chessPhase = getChessPhase(pieceCount, nextOpeningMoves.length > 0);

  const handleSelectOpening = (opening: Opening) => {
    loadFromPgn(opening.pgn);
  };

  const handleThemeSelect = async (theme: PuzzleTheme) => {
    setSelectedTheme(theme);
    await loadNewPuzzle(theme);
  };

  useEffect(() => {
    if (puzzle?.game?.pgn) {
      loadFromPgn(puzzle.game.pgn);
    }
  }, [puzzle?.game?.pgn, loadFromPgn]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <PgnViewer
        {...chessGame}
        previewMove={previewMove}
        goToMoveIndex={goToMoveIndex}
      />
      <div className="space-y-4">
        <Tabs defaultValue="opening">
          <TabsList>
            <TabsTrigger value="opening">{t("startWithOpening")}</TabsTrigger>
            <TabsTrigger value="puzzle">{t("startWithPuzzle")}</TabsTrigger>
          </TabsList>
          <TabsContent value="opening">
            <SearchOpeningCommand onSelectOpening={handleSelectOpening} />
          </TabsContent>
          <TabsContent value="puzzle">
            <SearchPuzzleCommand
              onThemeSelect={handleThemeSelect}
            />
          </TabsContent>
        </Tabs>
        <OpeningTree
          fenHistory={fenHistory}
          onTreeClick={goToMoveIndex}
        />
        {loading && (
          <p className="text-muted-foreground text-sm">퍼즐 로딩 중...</p>
        )}
        {error && <p className="text-destructive text-sm">{error}</p>}
        {puzzle && !loading && (
          <PuzzleInfo
            puzzle={puzzle}
            makeMove={chessGame.move}
            currentPgn={pgn}
            loadFromPgn={loadFromPgn}
            onPreviewMoveChange={setPreviewMove}
          />
        )}
        <GameInfo
          pgn={pgn}
          makeMove={chessGame.move}
          onPreviewMoveChange={setPreviewMove}
          chessPhase={chessPhase}
          fen={fen}
        />
      </div>
    </div>
  );
};

export default HomePage;
