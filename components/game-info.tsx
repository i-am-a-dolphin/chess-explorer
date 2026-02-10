"use client";

import { useTranslations } from "next-intl";

import { EndgameMoveFetcher } from "@/features/endgame-move-fetcher/components/endgame-move-fetcher";
import { OpeningMoveList } from "@/features/opening-move-list/components/opening-move-list";
import type { ChessPhase } from "@/types/core";

type GameInfoProps = {
  pgn: string;
  makeMove: (orig: string, dest: string, promotion?: string) => void;
  onPreviewMoveChange?: (uci: string | null) => void;
  chessPhase: ChessPhase;
  fen: string;
};

export const GameInfo = ({
  pgn,
  makeMove,
  onPreviewMoveChange,
  chessPhase,
  fen,
}: GameInfoProps) => {
  const t = useTranslations("chess");

  let content: React.ReactNode = null;
  let labelText = t("possibleNextMoves");

  switch (chessPhase) {
    case "opening":
      labelText = t("nextOpeningMoves");
      content = (
        <OpeningMoveList
          pgn={pgn}
          makeMove={makeMove}
          onPreviewMoveChange={onPreviewMoveChange}
        />
      );
      break;
    case "middlegame":
      labelText = "";
      content = null; // 미들게임 전략은 현재 표시하지 않음
      break;
    case "endgame":
      labelText = t("possibleNextMoves");
      content = (
        <EndgameMoveFetcher
          fen={fen}
          makeMove={makeMove}
          onPreviewMoveChange={onPreviewMoveChange}
        />
      );
      break;
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium">{labelText}</label>
        <span className="text-muted-foreground text-xs">{t(chessPhase)}</span>
      </div>
      {content}
    </>
  );
};
