"use client";

import { useMemo } from "react";

import { getNextOpeningMoves, parseSinglePgn } from "@/utils/opening-utils";

import { OpeningMoveButton } from "./opening-move-button";

type OpeningMoveListProps = {
  pgn: string;
  makeMove: (orig: string, dest: string, promotion?: string) => void;
  onPreviewMoveChange?: (uci: string | null) => void;
};

export const OpeningMoveList = ({
  pgn,
  makeMove,
  onPreviewMoveChange,
}: OpeningMoveListProps) => {
  const nextOpeningMoves = useMemo(() => getNextOpeningMoves(pgn), [pgn]);

  const game = parseSinglePgn(pgn);

  if (game === null) {
    return null;
  }

  const turnColor =
    Array.from(game.moves.mainline()).length % 2 === 0 ? "white" : "black";

  return (
    <div className="flex flex-wrap gap-2">
      {nextOpeningMoves.map((moveData) => (
        <OpeningMoveButton
          turnColor={turnColor}
          key={moveData.san}
          moveData={moveData}
          pgn={pgn}
          makeMove={makeMove}
          onPreviewMoveChange={onPreviewMoveChange}
        />
      ))}
    </div>
  );
};
