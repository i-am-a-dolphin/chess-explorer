"use client";

import {
  FlipVerticalIcon,
  Redo2Icon,
  RotateCcwIcon,
  Undo2Icon,
} from "lucide-react";

import { ColorSchemeDropdown } from "@/components/color-scheme-dropdown";
import { LanguageDropdown } from "@/components/language-dropdown";
import { Button } from "@/components/shadcn-ui/button";
import { ButtonGroup } from "@/components/shadcn-ui/button-group";
import { useChessgroundOrientation } from "@/features/chessground/hooks/use-chessground-orientation";

type ControlButtonsProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
};

export const ControlButtons = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
}: ControlButtonsProps) => {
  const { toggleChessgroundOrientation } = useChessgroundOrientation();

  return (
    <div className="flex gap-2">
      <ButtonGroup>
        <Button
          onClick={onUndo}
          size="icon"
          variant="outline"
          disabled={!canUndo}
        >
          <Undo2Icon className="size-4" />
        </Button>
        <Button
          onClick={onRedo}
          size="icon"
          variant="outline"
          disabled={!canRedo}
        >
          <Redo2Icon className="size-4" />
        </Button>
        <Button
          onClick={toggleChessgroundOrientation}
          size="icon"
          variant="outline"
        >
          <FlipVerticalIcon className="size-4" />
        </Button>
        <Button onClick={onReset} size="icon" variant="outline">
          <RotateCcwIcon className="size-4" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <LanguageDropdown />
        <ColorSchemeDropdown />
      </ButtonGroup>
    </div>
  );
};
