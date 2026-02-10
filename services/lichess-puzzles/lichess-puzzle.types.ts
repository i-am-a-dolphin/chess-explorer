export type PerfKey =
  | "ultraBullet"
  | "bullet"
  | "blitz"
  | "rapid"
  | "classical"
  | "correspondence"
  | "chess960"
  | "crazyhouse"
  | "antichess"
  | "atomic"
  | "horde"
  | "kingOfTheHill"
  | "racingKings"
  | "threeCheck";

export type PlayerTitle =
  | "GM" // Grandmaster, 2500+
  | "WGM" // Woman Grandmaster, 2300+
  | "IM" // International Master, 2400+
  | "WIM" // Woman International Master, 2200+
  | "FM" // FIDE Master, 2300+
  | "WFM" // Woman FIDE Master, 2100+
  | "CM" // Candidate Master, 2200+
  | "WCM" // Woman Candidate Master, 2000+
  | "NM" // National Master
  | "WNM" // Woman National Master
  | "LM" // Lichess Master
  | "BOT"; // Bot player

export type Player = {
  color: "white" | "black";
  id: string;
  name: string;
  title?: PlayerTitle;
  rating: number;
  flair?: string;
  patronColor?: number; // 1-10
};

// Lichess API 응답 타입
export type LichessPuzzleResponse = {
  game: {
    id: string;
    perf: {
      key: PerfKey;
      name: string;
    };
    rated: boolean;
    players: Player[];
    pgn: string;
    clock: string;
  };
  puzzle: {
    id: string;
    rating: number;
    plays: number;
    solution: string[];
    themes: string[];
    initialPly: number;
  };
};

export type PuzzleState = {
  puzzle: LichessPuzzleResponse | null;
  currentMoveIndex: number;
  isCorrect: boolean | null;
  isCompleted: boolean;
};
