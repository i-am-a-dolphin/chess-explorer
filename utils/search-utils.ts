import { disassemble, getChoseong } from "es-hangul";

const LOCALE_KOREAN = "ko";

export const basicTextSearch = (text: string, query: string): boolean => {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  return lowerText.includes(lowerQuery);
};

export const koreanTextSearch = (text: string, query: string): boolean => {
  const choseong = getChoseong(text);
  if (choseong.toLowerCase().includes(query.toLowerCase())) {
    return true;
  }

  const disassembled = disassemble(text);
  const queryDisassembled = disassemble(query);
  if (disassembled.toLowerCase().includes(queryDisassembled.toLowerCase())) {
    return true;
  }

  return false;
};

export const matchesSearchQuery = (
  text: string,
  query: string,
  locale: string,
  localizedText?: string,
): boolean => {
  if (basicTextSearch(text, query)) {
    return true;
  }

  if (locale === LOCALE_KOREAN && localizedText) {
    return koreanTextSearch(localizedText, query);
  }

  return false;
};
