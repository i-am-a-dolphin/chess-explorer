import { useFetch } from "@mantine/hooks";

import { TABLEBASE_ENDPOINTS } from "@/services/endpoint.constant";
import { encodeFen } from "@/utils/string-utils";
import { getUrl } from "@/utils/url-utils";

import type {
  LichessTablebaseMainlineResponse,
  LichessTablebaseStandardResponse,
} from "./lichess-tablebase.types";

export const useLichessTablebaseQuery = (
  fen: string,
  options?: { enabled?: boolean },
) => {
  const url = getUrl(TABLEBASE_ENDPOINTS.standard, {
    searchParams: {
      fen: encodeFen(fen),
    },
  });

  return useFetch<LichessTablebaseStandardResponse>(url.toString(), {
    autoInvoke: options?.enabled ?? !!fen,
    cache: "force-cache",
  });
};

export const useLichessTablebaseMainlineQuery = (
  fen: string,
  options?: { enabled?: boolean },
) => {
  const url = getUrl(TABLEBASE_ENDPOINTS.standardMainline, {
    searchParams: {
      fen: encodeFen(fen),
    },
  });

  return useFetch<LichessTablebaseMainlineResponse>(url.toString(), {
    autoInvoke: options?.enabled ?? !!fen,
    cache: "force-cache",
  });
};
