"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { useChessgroundOrientation } from "@/features/chessground/hooks/use-chessground-orientation";
import { getBoardImageUrl } from "@/utils/chess-utils";

type SearchOpeningPreviewProps = {
  hoveredOpeningFen: string | null;
  searchQuery: string;
};

export const SearchOpeningPreview = ({
  hoveredOpeningFen,
  searchQuery,
}: SearchOpeningPreviewProps) => {
  const t = useTranslations("chess");
  const { chessgroundOrientation } = useChessgroundOrientation();

  return (
    <div className="aspect-square p-2">
      {hoveredOpeningFen ? (
        <Image
          src={getBoardImageUrl(hoveredOpeningFen, chessgroundOrientation)}
          alt="Board position"
          width={256}
          height={256}
        />
      ) : (
        <div className="text-center text-sm text-gray-400">
          {searchQuery ? t("noOpeningsFound") : t("typeToSearch")}
        </div>
      )}
    </div>
  );
};
