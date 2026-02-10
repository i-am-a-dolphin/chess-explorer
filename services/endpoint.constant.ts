export const TABLEBASE_API_BASE = "https://tablebase.lichess.ovh";

export const TABLEBASE_ENDPOINTS = {
  standard: `${TABLEBASE_API_BASE}/standard`,
  standardMainline: `${TABLEBASE_API_BASE}/standard/mainline`,
} as const;

export const LICHESS_API_BASE = "https://lichess.org/api";

export const LICHESS_ENDPOINTS = {
  puzzle: `${LICHESS_API_BASE}/puzzle`,
} as const;

export const FEN_TO_IMAGE_BASE = "https://fen2image.chessvision.ai";
