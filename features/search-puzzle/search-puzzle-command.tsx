"use client";

import { useDebouncedState } from "@mantine/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { PuzzleTheme } from "@/__generated/puzzles";
import { PUZZLE_THEMES_BY_CATEGORY } from "@/__generated/puzzles";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn-ui/command";
import { useLocalizedTheme } from "@/hooks/use-localized-theme";
import { matchesSearchQuery } from "@/utils/search-utils";

import { SearchPuzzleInput } from "./search-puzzle-input";

type SearchPuzzleCommandProps = {
  onThemeSelect: (theme: PuzzleTheme) => void;
};

export function SearchPuzzleCommand({
  onThemeSelect,
}: SearchPuzzleCommandProps) {
  const t = useTranslations("chess");
  const { getThemeLabel, getCategoryLabel } = useLocalizedTheme();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useDebouncedState("", 300);

  const handleSelectTheme = (theme: PuzzleTheme) => {
    onThemeSelect(theme);
    setOpen(false);
    setSearchQuery("");
  };

  const groupedThemes = useMemo(() => {
    if (!searchQuery.trim()) {
      // 검색이 비어있으면 모든 테마 표시
      return PUZZLE_THEMES_BY_CATEGORY.map(
        (category) => [getCategoryLabel(category), category.themes] as const,
      );
    }

    // 검색어가 있으면 필터링
    return PUZZLE_THEMES_BY_CATEGORY.map(
      (category) =>
        [
          getCategoryLabel(category),
          category.themes.filter((theme) => {
            const searchName = getThemeLabel(theme);
            const fallbackSearchName = getThemeLabel(theme);
            return matchesSearchQuery(
              searchName,
              searchQuery,
              locale,
              fallbackSearchName,
            );
          }),
        ] as const,
    );
  }, [getCategoryLabel, getThemeLabel, locale, searchQuery]);

  return (
    <>
      <SearchPuzzleInput onClick={() => setOpen(true)} />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t("typeToSearch")}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandGroup>
              {groupedThemes.map(([category, themes]) =>
                themes.length > 0 ? (
                  <div key={category}>
                    <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                      {category}
                    </div>
                    {themes.map((theme) => (
                      <CommandItem
                        key={theme.id}
                        value={theme.id.toString()}
                        onSelect={() => handleSelectTheme(theme)}
                      >
                        <span className="flex-1 text-sm font-medium">
                          {getThemeLabel(theme)}
                        </span>
                        <span className="text-muted-foreground ml-auto text-xs">
                          {theme.frequency.toLocaleString()}
                        </span>
                      </CommandItem>
                    ))}
                  </div>
                ) : null,
              )}
            </CommandGroup>
            <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
