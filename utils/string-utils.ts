export const encodeFen = (fen: string): string => {
  return fen.replace(new RegExp(" ", "g"), "_");
};

export const decodeFen = (encodedFen: string): string => {
  return encodedFen.replace(new RegExp("_", "g"), " ");
};

export const extractUciOrigin = (uci: string): string => {
  return uci.slice(0, 2);
};

export const extractUciDestination = (uci: string): string => {
  return uci.slice(2, 4);
};

export const extractUciSquares = (
  uci: string,
): { origin: string; destination: string } => {
  return {
    origin: extractUciOrigin(uci),
    destination: extractUciDestination(uci),
  };
};

export const isPromotionMove = (uci: string): boolean => {
  return uci.length === 5;
};

export const extractPromotionPiece = (uci: string): string | undefined => {
  return isPromotionMove(uci) ? uci[4] : undefined;
};

export const parsePgnMoves = (moveString: string): string[] => {
  // PGN 헤더 줄 제거 (대괄호로 시작하는 줄)
  const withoutHeaders = moveString
    .split("\n")
    .filter((line) => !line.trim().startsWith("["))
    .join(" ");

  return withoutHeaders.split(/\s+/).filter((token) => {
    const trimmed = token.trim();
    // 빈 문자열, 수 번호, 결과 표시 제거
    return (
      trimmed !== "" &&
      !/^\d+\./.test(trimmed) &&
      !["*", "1-0", "0-1", "1/2-1/2"].includes(trimmed)
    );
  });
};
