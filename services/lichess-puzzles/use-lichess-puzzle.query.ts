import { useFetch } from "@mantine/hooks";

import { LICHESS_ENDPOINTS } from "@/services/endpoint.constant";
import type { LichessPuzzleResponse } from "@/services/lichess-puzzles/lichess-puzzle.types";
import { getUrl } from "@/utils/url-utils";

export function useLichessPuzzleByIdQuery(puzzleId?: string | null) {
  const url = puzzleId
    ? getUrl(LICHESS_ENDPOINTS.puzzle, { pathname: puzzleId })
    : "";

  return useFetch<LichessPuzzleResponse>(url.toString(), {
    autoInvoke: Boolean(puzzleId),
    cache: "force-cache",
  });
}
