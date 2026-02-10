"use client";

import { Button } from "@/components/shadcn-ui/button";
import type { TurnColor } from "@/types/core";
import { getPieceUnicode } from "@/utils/chess-utils";

type MoveButtonProps = {
  move: string;
  turnColor: TurnColor;
  uci: string;
  onClick: () => void;
  onPreviewMoveChange?: (uci: string | null) => void;
};

export const MoveButton = ({
  move,
  turnColor,
  uci,
  onClick,
  onPreviewMoveChange,
}: MoveButtonProps) => {
  const displayText = `${getPieceUnicode(move, turnColor)} ${move}`;

  return (
    <Button
      onClick={onClick}
      onMouseEnter={() => onPreviewMoveChange?.(uci)}
      onMouseLeave={() => onPreviewMoveChange?.(null)}
      variant="outline"
      size="sm"
      className="font-semibold"
    >
      {displayText}
    </Button>
  );
};
