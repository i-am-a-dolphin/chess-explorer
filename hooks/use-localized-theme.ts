import { useLocale } from "next-intl";
import { useCallback } from "react";

type ThemeLabel = { theme_ko: string; theme_en: string };
type CategoryLabel = { categoryKo: string; categoryEn: string };

export function useLocalizedTheme() {
  const locale = useLocale();

  const getThemeLabel = useCallback(
    (theme: ThemeLabel) => {
      switch (locale) {
        case "ko":
          return theme.theme_ko;
        case "en":
        default:
          return theme.theme_en;
      }
    },
    [locale],
  );

  const getCategoryLabel = useCallback(
    (category: CategoryLabel) => {
      switch (locale) {
        case "ko":
          return category.categoryKo;
        case "en":
        default:
          return category.categoryEn;
      }
    },
    [locale],
  );

  return {
    locale,
    getThemeLabel,
    getCategoryLabel,
  };
}
