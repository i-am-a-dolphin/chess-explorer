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
import { getPieceUnicode } from "@/utils/chess-utils";

type MoveHistoryTableProps = {
  pgn: string;
  goToMoveIndex: (moveIndex: number) => void;
};

export const MoveHistoryTable = ({
  pgn,
  goToMoveIndex,
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
    <div className="w-full max-w-lg">
      <label className="mb-2 block text-sm font-medium">
        {t("moveHistory")}
      </label>
      <div className="max-h-64 overflow-y-auto">
        {moveHistory.length > 0 ? (
          <div className="overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-200 dark:bg-gray-700">
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="w-14 px-3 py-2 text-right font-semibold">#</th>
                  <th className="border-l border-gray-300 px-3 py-2 text-left font-semibold dark:border-gray-600">
                    ⚪ {t("white")}
                  </th>
                  <th className="border-l border-gray-300 px-3 py-2 text-left font-semibold dark:border-gray-600">
                    ⚫ {t("black")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {moveHistory.map(({ moveNumber, white, black }) => (
                  <tr
                    key={moveNumber}
                    className="border-b border-gray-200 transition-colors last:border-0 dark:border-gray-700"
                  >
                    <td className="px-3 py-2 text-right font-medium text-gray-600 dark:text-gray-400">
                      {moveNumber}
                    </td>
                    <td
                      className="cursor-pointer border-l border-gray-300 px-3 py-2 font-mono hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                      onClick={() => goToMoveIndex(moveNumber * 2 - 2)}
                    >
                      {getPieceUnicode(white, "white")} {white}
                    </td>
                    <td
                      className="cursor-pointer border-l border-gray-300 px-3 py-2 font-mono hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                      onClick={() => black && goToMoveIndex(moveNumber * 2 - 1)}
                    >
                      {black
                        ? `${getPieceUnicode(black, "black")} ${black}`
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty className="rounded-md border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClipboardListIcon className="size-5" />
              </EmptyMedia>
              <EmptyTitle>{t("noMovesYet")}</EmptyTitle>
              <EmptyDescription>{t("makeMove")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  );
};
