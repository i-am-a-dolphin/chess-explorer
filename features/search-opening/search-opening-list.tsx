"use client";

import { useLocale, useTranslations } from "next-intl";

import type { Opening } from "@/__generated/openings";
import { Badge } from "@/components/shadcn-ui/badge";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/shadcn-ui/command";

type SearchOpeningProps = {
  filteredOpenings: Opening[];
  searchQuery: string;
  onSelectOpening: (opening: Opening) => void;
  onHoverChange: (index: number) => void;
};

export const SearchOpeningList = ({
  filteredOpenings,
  searchQuery,
  onSelectOpening,
  onHoverChange,
}: SearchOpeningProps) => {
  const t = useTranslations("chess");
  const locale = useLocale();

  return (
    <div className="flex-1">
      <CommandList>
        {filteredOpenings.length > 0 && (
          <CommandGroup>
            {filteredOpenings.map((opening, idx) => {
              return (
                <CommandItem
                  key={opening.pgn}
                  value={opening.pgn}
                  onSelect={() => onSelectOpening(opening)}
                  onMouseEnter={() => onHoverChange(idx)}
                >
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Badge variant="secondary">{opening.eco}</Badge>
                      <span>
                        {locale === "ko" && opening.name_ko
                          ? opening.name_ko
                          : opening.name}
                      </span>
                    </div>
                    <span className="ml-4 text-xs text-gray-400">
                      +{opening.moveCount}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
        <CommandEmpty>
          {searchQuery ? t("noOpeningsFound") : t("typeToSearch")}
        </CommandEmpty>
      </CommandList>
    </div>
  );
};
