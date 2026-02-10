// Search URL constants
const GOOGLE_SEARCH_URL = "https://www.google.com/search";
const YOUTUBE_SEARCH_URL = "https://www.youtube.com/results";

const joinPathnames = (...pathnames: string[]): string => {
  const segments = pathnames.flatMap((pathname) =>
    pathname.split("/").filter(Boolean),
  );
  const joined = segments
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return joined;
};

export const getUrl = (
  base: string,
  options?: {
    pathname?: string;
    searchParams?: Record<string, string>;
  },
): URL => {
  const url = new URL(base);

  if (options?.pathname) {
    url.pathname = joinPathnames(url.pathname, options.pathname);
  }

  if (options?.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url;
};

/**
 * Opens a URL in a new tab
 */
export const openUrl = (url: string, target: string = "_blank"): void => {
  window.open(url, target);
};

/**
 * Opens Google search for the given query
 */
export const openGoogleSearch = (query: string): void => {
  const url = new URL(GOOGLE_SEARCH_URL);
  url.searchParams.set("q", query);
  openUrl(url.toString());
};

/**
 * Opens YouTube search for the given query
 */
export const openYouTubeSearch = (query: string): void => {
  const url = new URL(YOUTUBE_SEARCH_URL);
  url.searchParams.set("search_query", query);
  openUrl(url.toString());
};
