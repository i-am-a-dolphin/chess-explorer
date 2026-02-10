"use client";

import { Chess } from "chess.js";
import { ClipboardXIcon, Loader2Icon, OctagonAlertIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/shadcn-ui/empty";
import { useChessgroundOrientation } from "@/features/chessground/hooks/use-chessground-orientation";
import type { LichessTablebaseStandardMove } from "@/services/lichess-tablebase/lichess-tablebase.types";
import { useLichessTablebaseMainlineQuery } from "@/services/lichess-tablebase/use-lichess-tablebase.query";
import { getBoardImageUrl } from "@/utils/chess-utils";

type EndgameMoveMainlineProps = {
  move: LichessTablebaseStandardMove;
  fen: string;
  evaluation: string;
  onMoveClick: (uci: string) => void;
};

export const EndgameMoveMainline = ({
  move,
  fen,
  evaluation,
  onMoveClick,
}: EndgameMoveMainlineProps) => {
  const t = useTranslations("chess");
  const [open, setOpen] = useState(false);
  const [hoveredSubMoveIdx, setHoveredSubMoveIdx] = useState<number | null>(
    null,
  );
  const { chessgroundOrientation } = useChessgroundOrientation();

  const getMoveFen = (): string | null => {
    try {
      const chess = new Chess(fen);
      chess.move(move.uci);
      return chess.fen();
    } catch {
      return null;
    }
  };

  const moveFen = getMoveFen();
  const { data, loading, error } = useLichessTablebaseMainlineQuery(moveFen || "", {
    enabled: open && !!moveFen,
  });

  const isRateLimited = error?.message?.includes("429");

  const handleMainlineClick = (upToIndex: number) => {
    onMoveClick(move.uci);

    const mainline = data?.mainline;
    if (!mainline) return;

    for (let i = 0; i <= upToIndex; i++) {
      const subMove = mainline[i];
      if (subMove) {
        onMoveClick(subMove.uci);
      }
    }
  };

  const getMainlineFen = (upToIndex: number): string | null => {
    const mainline = data?.mainline;
    if (!mainline || !moveFen) return null;

    try {
      const chess = new Chess(moveFen);

      for (let i = 0; i <= upToIndex; i++) {
        const subMove = mainline[i];
        if (subMove) {
          chess.move(subMove.uci);
        }
      }
      return chess.fen();
    } catch {
      return null;
    }
  };

  const mainline = data?.mainline;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="px-2">
          {evaluation}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="flex overflow-hidden">
        {mainline && mainline.length > 0 ? (
          <>
            <div className="flex max-h-70 flex-col gap-1 overflow-y-auto">
              <DropdownMenuItem
                key={-1}
                onClick={() => onMoveClick(move.uci)}
                onMouseEnter={() => setHoveredSubMoveIdx(null)}
                className="flex w-20 cursor-pointer items-center justify-between gap-2 px-2 py-1 text-xs"
              >
                <span className="font-mono">{move.san}</span>
                <span className="ml-2 text-gray-400">-{mainline.length}</span>
              </DropdownMenuItem>
              {mainline.map((subMove, idx) => {
                const moveLineLeft = mainline.length - idx - 1;
                return (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() => handleMainlineClick(idx)}
                    onMouseEnter={() => setHoveredSubMoveIdx(idx)}
                    className="flex w-20 cursor-pointer items-center justify-between gap-2 px-2 py-1 text-xs"
                  >
                    <span className="font-mono">{subMove.san}</span>
                    {moveLineLeft > 0 && (
                      <span className="ml-2 text-gray-400">
                        -{moveLineLeft}
                      </span>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </div>
            <Image
              src={getBoardImageUrl(
                hoveredSubMoveIdx === null
                  ? moveFen || fen
                  : getMainlineFen(hoveredSubMoveIdx) || fen,
                chessgroundOrientation,
              )}
              alt="Board position"
              width={256}
              height={256}
              className="ml-2"
            />
          </>
        ) : loading ? (
          <div className="flex h-70 w-80 items-center justify-center">
            <Loader2Icon className="size-5 animate-spin" />
          </div>
        ) : isRateLimited ? (
          <Empty className="h-70 w-80">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <OctagonAlertIcon className="size-5" />
              </EmptyMedia>
              <EmptyTitle>{t("rateLimitExceeded")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <Empty className="h-70 w-80">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClipboardXIcon className="size-5" />
              </EmptyMedia>
              <EmptyTitle>{t("noMainline")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
