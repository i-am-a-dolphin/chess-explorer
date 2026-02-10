"use client";

import { useMounted } from "@mantine/hooks";
import { useTheme } from "next-themes";

export const FaviconSwitcher = () => {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <img
        src="/favicon.svg"
        alt="Chess Explorer"
        className="h-6 w-6"
      />
    );
  }

  return (
    <img
      src={resolvedTheme === "dark" ? "/favicon-dark.svg" : "/favicon.svg"}
      alt="Chess Explorer"
      className="h-6 w-6"
    />
  );
};
