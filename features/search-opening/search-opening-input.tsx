"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { OPENINGS } from "@/__generated/openings";
import { InputShapedButton } from "@/components/input-shaped-button";

type SearchOpeningInputProps = {
  onClick: () => void;
};

export const SearchOpeningInput = ({ onClick }: SearchOpeningInputProps) => {
  const t = useTranslations("chess");
  const locale = useLocale();
  const [placeholder, setPlaceholder] = useState(t("example"));

  useEffect(() => {
    const randomOpening = OPENINGS[Math.floor(Math.random() * OPENINGS.length)];
    const openingName =
      locale === "ko" ? randomOpening.name_ko : randomOpening.name;
    setPlaceholder(`${t("example")} ${openingName}`);
  }, [locale, t]);

  return (
    <InputShapedButton
      onClick={onClick}
      placeholder={placeholder}
      title="Search openings (⌘K)"
    />
  );
};
