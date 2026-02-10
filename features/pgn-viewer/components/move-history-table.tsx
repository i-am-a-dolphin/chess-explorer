"use client";

import { parsePgn } from "chessops/pgn";
import { ClipboardListIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/shadcn-ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-ui/table";
import { getPieceUnicode } from "@/utils/chess-utils";

type MoveHistoryTableProps = {
  pgn: string;
  goToMoveIndex: (moveIndex: number) => void;
  currentMoveIndex: number;
};

export const MoveHistoryTable = ({
  pgn,
  goToMoveIndex,
  currentMoveIndex,
}: MoveHistoryTableProps) => {
  const t = useTranslations("chess");

  const moveHistory = useMemo(() => {
    if (!pgn) return [];

    const parsed = parsePgn(pgn);
    if (parsed.length === 0) return [];

    const game = parsed[0];
    const moves = Array.from(game.moves.mainline());

    const history: { moveNumber: number; white: string; black?: string }[] = [];
    for (let i = 0; i < moves.length; i += 2) {
      history.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: moves[i].san,
        black: moves[i + 1]?.san,
      });
    }

    return history;
  }, [pgn]);

  return (
    <div className="h-full lg:w-60 max-h-120 flex flex-col rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
      {moveHistory.length > 0 ? (
        <div className="flex flex-col h-full overflow-hidden">
          <Table className="border-collapse">
            <TableHeader className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
              <TableRow
                className="border-b border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 h-auto"
                onClick={() => goToMoveIndex(-1)}
                title={t("initialPosition")}
              >
                <TableHead className="w-8 px-1 py-1.5 text-right font-semibold h-auto">
                  #
                </TableHead>
                <TableHead className="border-l border-gray-300 px-2 py-1.5 text-left font-semibold dark:border-gray-600 h-auto">
                  ⚪ {t("white")}
                </TableHead>
                <TableHead className="border-l border-gray-300 px-2 py-1.5 text-left font-semibold dark:border-gray-600 h-auto">
                  ⚫ {t("black")}
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <div className="overflow-y-auto flex-1">
            <Table className="border-collapse">
              <TableBody>
                {moveHistory.map(({ moveNumber, white, black }) => {
                  const whiteMoveIndex = moveNumber * 2 - 2;
                  const blackMoveIndex = moveNumber * 2 - 1;
                  const isWhiteActive = currentMoveIndex === whiteMoveIndex;
                  const isBlackActive = currentMoveIndex === blackMoveIndex;

                  return (
                    <TableRow
                      key={moveNumber}
                      className="border-b border-gray-200 transition-colors last:border-0 dark:border-gray-700 h-auto"
                    >
                      <TableCell className="px-1 py-1.5 text-right text-xs font-medium text-gray-600 dark:text-gray-400 h-auto">
                        {moveNumber}
                      </TableCell>
                      <TableCell
                        className={`cursor-pointer border-l border-gray-300 px-2 py-1.5 font-mono dark:border-gray-600 h-auto ${isWhiteActive
                            ? "bg-blue-200 dark:bg-blue-700 font-bold"
                            : "hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        onClick={() => goToMoveIndex(whiteMoveIndex)}
                      >
                        {getPieceUnicode(white, "white")} {white}
                      </TableCell>
                      <TableCell
                        className={`cursor-pointer border-l border-gray-300 px-2 py-1.5 font-mono dark:border-gray-600 h-auto ${isBlackActive
                            ? "bg-blue-200 dark:bg-blue-700 font-bold"
                            : "hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        onClick={() => black && goToMoveIndex(blackMoveIndex)}
                      >
                        {black
                          ? `${getPieceUnicode(black, "black")} ${black}`
                          : ""}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <Empty className="flex-1 flex items-center justify-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardListIcon className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="text-sm">{t("noMovesYet")}</EmptyTitle>
            <EmptyDescription className="text-sm">{t("makeMove")}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
};
