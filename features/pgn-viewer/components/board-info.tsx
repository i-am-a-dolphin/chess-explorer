"use client";

import { useClipboard } from "@mantine/hooks";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/shadcn-ui/button";

type BoardInfoProps = {
  fen: string;
  turnColor: "white" | "black";
};

export const BoardInfo = ({ fen, turnColor }: BoardInfoProps) => {
  const t = useTranslations("chess");
  const { copied, copy } = useClipboard();

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <div className="text-2xs font-mono break-all text-gray-500 dark:text-gray-400">
          {fen}
        </div>
        <Button
          variant="ghost"
          className="p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          size="icon-xs"
          onClick={() => copy(fen)}
          disabled={copied}
          title={copied ? "Copied!" : "Copy FEN"}
        >
          {copied ? (
            <CheckIcon className="size-3" />
          ) : (
            <CopyIcon className="size-3" />
          )}
        </Button>
      </div>
      <div className="text-center text-sm text-gray-700 dark:text-gray-300">
        {turnColor === "white" ? t("white") : t("black")} {t("toMove")}
      </div>
    </>
  );
};

export const FenInfo = ({ fen }: { fen: string }) => {
  const { copied, copy } = useClipboard();

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="text-2xs font-mono break-all text-gray-500 dark:text-gray-400">
        {fen}
      </div>
      <Button
        variant="ghost"
        className="p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        size="icon-xs"
        onClick={() => copy(fen)}
        disabled={copied}
        title={copied ? "Copied!" : "Copy FEN"}
      >
        {copied ? (
          <CheckIcon className="size-3" />
        ) : (
          <CopyIcon className="size-3" />
        )}
      </Button>
    </div>
  );
};
