export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type Square = `${File}${Rank}`;

export type WhitePiece = "P" | "N" | "B" | "R" | "Q" | "K";
export type BlackPiece = "p" | "n" | "b" | "r" | "q" | "k";
export type Piece = WhitePiece | BlackPiece;
export type Promotion = "Q" | "R" | "B" | "N" | "q" | "r" | "b" | "n";
export type CastlingRight = "K" | "Q" | "k" | "q";
export type Turn = "w" | "b";
export type TurnColor = "white" | "black";

export type Lan =
  | `0000`
  | `${Square}${Square}`
  | `${Square}${Square}${Promotion}`;

/**
 * UCI: space-separated LAN moves
 * Example: "e2e4 e7e5 g1f3"
 */
export type Uci = string;

export type FenRank = string;

/**
 * FEN piece placement field - piece positions on the board
 * Format: Ranks separated by "/" (8 to 1)
 * Example: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
 */
export type FenPiecePlacement =
  `${FenRank}/${FenRank}/${FenRank}/${FenRank}/${FenRank}/${FenRank}/${FenRank}/${FenRank}`;

/**
 * FEN active color field - whose turn it is
 */
export type FenActiveColor = Turn;

/**
 * FEN castling availability field
 * "-" = no castling available
 * Otherwise any combination of castling rights: "KQkq", "Kq", "K", etc.
 */
export type FenCastlingAvailability = string;

export type FenEnPassantTarget = "-" | Square;
export type FenHalfmoveClock = number;
export type FenFullmoveNumber = number;

export type Epd =
  `${FenPiecePlacement} ${FenActiveColor} ${FenCastlingAvailability} ${FenEnPassantTarget}`;

export type Fen = `${Epd} ${FenHalfmoveClock} ${FenFullmoveNumber}`;
export type Pgn = string;
export type San = string;
/**
 * ECO (Encyclopedia of Chess Openings) code
 * Format: Letter (A-E) + two digits (00-99)
 * Example: "A00", "B12", "E99"
 */
type EcoLetter = "A" | "B" | "C" | "D" | "E";
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type Eco = `${EcoLetter}${Digit}${Digit}`;

export type ChessPhase = "opening" | "middlegame" | "endgame";
