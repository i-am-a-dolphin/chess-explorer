"use client";

import { useTranslations } from "next-intl";

import { useLichessTablebaseQuery } from "@/services/lichess-tablebase/use-lichess-tablebase.query";

import { EndgameMoveButton } from "./endgame-move-button";

type EndgameMoveFetcherProps = {
  fen: string;
  makeMove: (orig: string, dest: string, promotion?: string) => void;
  onPreviewMoveChange?: (uci: string | null) => void;
};

export const EndgameMoveFetcher = ({
  fen,
  makeMove,
  onPreviewMoveChange,
}: EndgameMoveFetcherProps) => {
  const t = useTranslations("chess");
  const { data, loading } = useLichessTablebaseQuery(fen);

  if (loading) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {t("loadingTablebase")}
      </div>
    );
  }

  if (data && data.moves.length > 0) {
    return (
      <EndgameMoveButton
        moves={data.moves}
        fen={fen}
        makeMove={makeMove}
        onPreviewMoveChange={onPreviewMoveChange}
      />
    );
  }

  return null;
};
