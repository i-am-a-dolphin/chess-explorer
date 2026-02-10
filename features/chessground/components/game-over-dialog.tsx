"use client";

import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn-ui/alert-dialog";

type GameOverDialogProps = {
  isGameOver: boolean;
  gameOverReason?: string | null;
  onRestart: () => void;
};

export const GameOverDialog = ({
  isGameOver,
  gameOverReason,
  onRestart,
}: GameOverDialogProps) => {
  const t = useTranslations("chess");

  if (!isGameOver || !gameOverReason) return null;

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("gameOver")}</AlertDialogTitle>
          <AlertDialogDescription>{gameOverReason}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onRestart}>
            {t("restart")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
