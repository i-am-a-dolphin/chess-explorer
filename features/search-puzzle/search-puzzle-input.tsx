"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { PUZZLE_THEMES } from "@/__generated/puzzles";
import { InputShapedButton } from "@/components/input-shaped-button";
import { useLocalizedTheme } from "@/hooks/use-localized-theme";

type SearchPuzzleInputProps = {
  onClick: () => void;
};

export const SearchPuzzleInput = ({ onClick }: SearchPuzzleInputProps) => {
  const t = useTranslations("chess");
  const { getThemeLabel, locale } = useLocalizedTheme();
  const [placeholder, setPlaceholder] = useState(t("example"));

  useEffect(() => {
    const randomTheme =
      PUZZLE_THEMES[Math.floor(Math.random() * PUZZLE_THEMES.length)];
    const themeLabel = getThemeLabel(randomTheme);
    setPlaceholder(`${t("example")} ${themeLabel}`);
  }, [getThemeLabel, locale, t]);

  return <InputShapedButton onClick={onClick} placeholder={placeholder} />;
};
