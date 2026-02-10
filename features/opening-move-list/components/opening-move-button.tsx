"use client";

import { parsePgn } from "chessops/pgn";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useCallback, useMemo, useState } from "react";

import type { Opening } from "@/__generated/openings";
import { MoveButton } from "@/components/move-button";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { ButtonGroup } from "@/components/shadcn-ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { useChessgroundOrientation } from "@/features/chessground/hooks/use-chessground-orientation";
import type { TurnColor } from "@/types/core";
import type { NextOpeningMove } from "@/types/openings";
import { convertPgnToFen, getBoardImageUrl } from "@/utils/chess-utils";
import { getUciMoveAt, parseUciMove, splitUciMoves } from "@/utils/move-utils";

type OpeningMoveButtonProps = {
  moveData: NextOpeningMove;
  turnColor: TurnColor;
  pgn: string;
  makeMove: (orig: string, dest: string, promotion?: string) => void;
  onPreviewMoveChange?: (uci: string | null) => void;
};

export const OpeningMoveButton = ({
  moveData,
  turnColor,
  pgn,
  makeMove,
  onPreviewMoveChange,
}: OpeningMoveButtonProps) => {
  const { san, openings } = moveData;
  const locale = useLocale();
  const [hoveredOpeningIdx, setHoveredOpeningIdx] = useState<number | null>(0);

  const firstOpening = openings[0];
  const currentMoveCount = useMemo(() => {
    const parsed = parsePgn(pgn);
    return parsed.length > 0
      ? Array.from(parsed[0].moves.mainline()).length
      : 0;
  }, [pgn]);

  const nextMove = useMemo(
    () => getUciMoveAt(firstOpening.uci, currentMoveCount),
    [firstOpening.uci, currentMoveCount],
  );

  const sortedOpenings = useMemo(() => {
    return [...openings].sort((a, b) => {
      if (a.moveCount !== b.moveCount) {
        return a.moveCount - b.moveCount;
      }
      return a.eco.localeCompare(b.eco);
    });
  }, [openings]);

  const hoveredOpening = useMemo(() => {
    return hoveredOpeningIdx !== null
      ? sortedOpenings[hoveredOpeningIdx]
      : null;
  }, [sortedOpenings, hoveredOpeningIdx]);

  const hoveredOpeningFen = useMemo(() => {
    return hoveredOpening
      ? (convertPgnToFen(hoveredOpening.pgn) as string)
      : null;
  }, [hoveredOpening]);

  const handleNextMove = useCallback(() => {
    if (nextMove.uci) {
      makeMove(nextMove.orig, nextMove.dest);
    }
    onPreviewMoveChange?.(null);
  }, [makeMove, nextMove, onPreviewMoveChange]);

  const handleOpeningClick = useCallback(
    (opening: Opening) => {
      const uciMoves = splitUciMoves(opening.uci);

      // 현재 위치부터 오프닝 끝까지 모든 수를 순차적으로 실행
      for (let i = currentMoveCount; i < uciMoves.length; i++) {
        const uciMove = uciMoves[i];
        const parsedMove = parseUciMove(uciMove);
        if (!parsedMove) continue;
        makeMove(parsedMove.orig, parsedMove.dest);
      }
    },
    [currentMoveCount, makeMove],
  );

  const { chessgroundOrientation } = useChessgroundOrientation();

  return (
    <ButtonGroup>
      <MoveButton
        move={san}
        turnColor={turnColor}
        uci={nextMove.uci}
        onClick={handleNextMove}
        onPreviewMoveChange={onPreviewMoveChange}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="px-2">
            {openings.length}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" className="flex overflow-hidden">
          <div className="flex max-h-70 flex-col gap-1 overflow-y-auto">
            {sortedOpenings.map((opening, idx) => {
              const displayName =
                locale === "ko" && opening.name_ko
                  ? opening.name_ko
                  : opening.name;

              return (
                <DropdownMenuItem
                  key={idx}
                  onClick={() => handleOpeningClick(opening)}
                  onMouseEnter={() => setHoveredOpeningIdx(idx)}
                  className="flex w-88 cursor-pointer items-center justify-between gap-2 px-2 py-1 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-2xs px-1.5 py-0">
                      {opening.eco}
                    </Badge>
                    <span>{displayName}</span>
                  </div>
                  <span className="text-2xs ml-2 text-gray-400">
                    +{opening.moveCount}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </div>
          {hoveredOpeningFen && (
            <div className="sticky top-0 border-l border-gray-200 pl-2 dark:border-gray-700">
              <Image
                src={getBoardImageUrl(
                  hoveredOpeningFen,
                  chessgroundOrientation,
                )}
                alt="Board position"
                width={256}
                height={256}
              />
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};
