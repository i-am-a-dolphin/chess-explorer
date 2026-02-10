"use client";

import { useTranslations } from "next-intl";

import { MoveButton } from "@/components/move-button";
import {
  ButtonGroup,
  ButtonGroupText,
} from "@/components/shadcn-ui/button-group";
import type { LichessTablebaseStandardMove } from "@/services/lichess-tablebase/lichess-tablebase.types";
import type { Fen } from "@/types/core";
import {
  getTablebaseOutcomeLabelKey,
  getTurnColorFromFen,
} from "@/utils/chess-utils";
import { parseUciMove, sortMovesByPieceAndSquare } from "@/utils/move-utils";

import { EndgameMoveMainline } from "./endgame-move-mainline";

type EndgameMoveButtonProps = {
  moves: LichessTablebaseStandardMove[];
  fen: string;
  makeMove: (orig: string, dest: string, promotion?: string) => void;
  onPreviewMoveChange?: (uci: string | null) => void;
};

export const EndgameMoveButton = ({
  moves,
  fen,
  makeMove,
  onPreviewMoveChange,
}: EndgameMoveButtonProps) => {
  const t = useTranslations("chess");
  const turnColor = getTurnColorFromFen(fen as Fen);

  const handleMoveClick = (uci: string) => {
    const parsedMove = parseUciMove(uci);
    if (parsedMove) {
      makeMove(parsedMove.orig, parsedMove.dest);
    }
  };

  const sortedMoves = sortMovesByPieceAndSquare(moves);

  return (
    <div className="flex flex-wrap gap-2">
      {sortedMoves.map((move) => {
        const evaluation =
          move.dtm !== null
            ? `${Math.abs(move.dtm)}`
            : move.dtz !== null
              ? `DTZ ${move.dtz}`
              : "-";
        const categoryLabel = t(
          getTablebaseOutcomeLabelKey(move.category, turnColor),
        );

        return (
          <ButtonGroup key={move.uci}>
            <MoveButton
              move={move.san}
              turnColor={turnColor}
              uci={move.uci}
              onClick={() => handleMoveClick(move.uci)}
              onPreviewMoveChange={onPreviewMoveChange}
            />
            <ButtonGroupText className="px-2 text-xs">
              {categoryLabel}
            </ButtonGroupText>
            <EndgameMoveMainline
              move={move}
              fen={fen}
              evaluation={evaluation}
              onMoveClick={handleMoveClick}
            />
          </ButtonGroup>
        );
      })}
    </div>
  );
};
