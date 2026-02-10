"use client";

import { useDebouncedState } from "@mantine/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import type { Opening} from "@/__generated/openings";
import { OPENING_MAP } from "@/__generated/openings";
import {
  Command,
  CommandDialog,
  CommandInput,
} from "@/components/shadcn-ui/command";
import { convertPgnToFen } from "@/utils/chess-utils";
import { matchesSearchQuery } from "@/utils/search-utils";

import { SearchOpeningInput } from "./search-opening-input";
import { SearchOpeningList } from "./search-opening-list";
import { SearchOpeningPreview } from "./search-opening-preview";

type SearchOpeningCommandProps = {
  onSelectOpening: (opening: Opening) => void;
};

export const SearchOpeningCommand = ({
  onSelectOpening,
}: SearchOpeningCommandProps) => {
  const locale = useLocale();
  const t = useTranslations("chess");
  const [searchQuery, setSearchQuery] = useDebouncedState("", 300);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOpeningIdx, setHoveredOpeningIdx] = useState<number | null>(
    null,
  );

  const allOpenings = useMemo(() => {
    return Object.values(OPENING_MAP) as Opening[];
  }, []);

  const filteredOpenings = useMemo(() => {
    if (!searchQuery.trim()) return allOpenings;

    return allOpenings.filter((opening) => {
      const searchName =
        locale === "ko" && opening.name_ko ? opening.name_ko : opening.name;

      return matchesSearchQuery(
        searchName,
        searchQuery,
        locale,
        opening.name_ko,
      );
    });
  }, [allOpenings, searchQuery, locale]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setHoveredOpeningIdx(0);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      // 방향키로 네비게이션
      if (isOpen && filteredOpenings.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHoveredOpeningIdx((prev) => {
            if (prev === null) return 0;
            return Math.min(prev + 1, filteredOpenings.length - 1);
          });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setHoveredOpeningIdx((prev) => {
            if (prev === null) return filteredOpenings.length - 1;
            return Math.max(prev - 1, 0);
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredOpenings.length]);

  const handleSelectOpening = (opening: Opening) => {
    onSelectOpening(opening);
    setIsOpen(false);
    setSearchQuery("");
  };

  const safeHoveredIndex =
    filteredOpenings.length === 0
      ? null
      : hoveredOpeningIdx === null
        ? 0
        : Math.min(hoveredOpeningIdx, filteredOpenings.length - 1);

  const hoveredOpening =
    safeHoveredIndex !== null ? filteredOpenings[safeHoveredIndex] : null;
  const hoveredOpeningFen = hoveredOpening
    ? convertPgnToFen(hoveredOpening.pgn)
    : null;

  return (
    <>
      <SearchOpeningInput onClick={() => setIsOpen(true)} />

      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={t("searchOpenings")}
        description={t("searchOpeningsDescription")}
        className="max-w-6xl"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t("typeToSearch")}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <div className="flex">
            <SearchOpeningList
              filteredOpenings={filteredOpenings}
              searchQuery={searchQuery}
              onSelectOpening={handleSelectOpening}
              onHoverChange={setHoveredOpeningIdx}
            />
            <SearchOpeningPreview
              hoveredOpeningFen={hoveredOpeningFen}
              searchQuery={searchQuery}
            />
          </div>
        </Command>
      </CommandDialog>
    </>
  );
};
