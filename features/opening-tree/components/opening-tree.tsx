"use client";

import { SearchIcon, YoutubeIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";

import type { Opening } from "@/__generated/openings";
import { OPENING_MAP } from "@/__generated/openings";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { ButtonGroup } from "@/components/shadcn-ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";
import { useChessgroundOrientation } from "@/features/chessground/hooks/use-chessground-orientation";
import { fenToEpd, getBoardImageUrl } from "@/utils/chess-utils";
import { openGoogleSearch, openYouTubeSearch } from "@/utils/url-utils";

type OpeningTreeProps = {
  fenHistory: string[];
  onTreeClick: (moveIndex: number) => void;
};

export const OpeningTree = ({
  fenHistory,
  onTreeClick,
}: OpeningTreeProps) => {
  const t = useTranslations("chess");
  const { chessgroundOrientation } = useChessgroundOrientation();

  const locale = useLocale();

  const openingTree = useMemo(() => {
    const tree: Array<{
      opening: Opening;
      fen: string;
      moveIndex: number;
    }> = [];
    // Reverse to show most recent first (descending)
    for (let i = fenHistory.length - 1; i >= 0; i--) {
      const historyFen = fenHistory[i];
      const epd = fenToEpd(historyFen);
      if (epd in OPENING_MAP) {
        const opening = OPENING_MAP[epd as keyof typeof OPENING_MAP] as Opening;
        // Avoid duplicates of same opening
        if (
          tree.length === 0 ||
          tree[tree.length - 1].opening.name !== opening.name
        ) {
          tree.push({ opening, fen: historyFen, moveIndex: i - 1 });
        }
      }
    }
    return tree;
  }, [fenHistory]);

  if (openingTree.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {t("openingTree")}
      </label>
      <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
        {openingTree.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                role="listitem"
                onClick={() =>
                  item.moveIndex >= 0 && onTreeClick(item.moveIndex)
                }
                className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-1 items-center gap-2 text-sm font-semibold">
                    <Badge variant="secondary">{item.opening.eco}</Badge>
                    <span>
                      {locale === "ko" && item.opening.name_ko
                        ? item.opening.name_ko
                        : item.opening.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.moveIndex >= 0 && (
                      <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {Math.floor(item.moveIndex / 2) + 1}.
                        {item.moveIndex % 2 === 0 ? "" : ".."}
                      </div>
                    )}
                    <ButtonGroup>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        title="Google"
                        onClick={(event) => {
                          event.stopPropagation();
                          const displayName =
                            locale === "ko" && item.opening.name_ko
                              ? item.opening.name_ko
                              : item.opening.name;
                          const searchSuffix =
                            locale === "ko" ? "체스 오프닝" : "chess opening";
                          const query = `${item.opening.eco} ${displayName} ${searchSuffix}`;
                          openGoogleSearch(query);
                        }}
                      >
                        <SearchIcon className="size-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        title="YouTube"
                        onClick={(event) => {
                          event.stopPropagation();
                          const displayName =
                            locale === "ko" && item.opening.name_ko
                              ? item.opening.name_ko
                              : item.opening.name;
                          const searchSuffix =
                            locale === "ko" ? "체스 오프닝" : "chess opening";
                          const query = `${item.opening.eco} ${displayName} ${searchSuffix}`;
                          openYouTubeSearch(query);
                        }}
                      >
                        <YoutubeIcon className="size-3" />
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="p-1">
              <Image
                src={getBoardImageUrl(item.fen, chessgroundOrientation)}
                alt="Board position"
                width={256}
                height={256}
              />
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
