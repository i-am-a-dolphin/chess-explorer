/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Chessground } from "@lichess-org/chessground";
import type { Api } from "@lichess-org/chessground/api";
import type { Config } from "@lichess-org/chessground/config";
import { useEffect, useRef, useState } from "react";

import { useChessgroundOrientation } from "./use-chessground-orientation";

export const useChessground = (
  initialConfig: Omit<Config, "orientation"> = {},
) => {
  const { chessgroundOrientation } = useChessgroundOrientation();
  const [config, setConfig] = useState(initialConfig);
  const [chessground, setChessground] = useState<Api | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && typeof window !== "undefined" && !chessground) {
      const newChessground = Chessground(ref.current, {
        ...config,
        orientation: chessgroundOrientation,
        drawable: {
          enabled: true,
          visible: true,
          brushes: {
            green: {
              key: "green",
              color: "#15781B",
              opacity: 0.8,
              lineWidth: 6,
            },
            red: {
              key: "red",
              color: "#882020",
              opacity: 0.8,
              lineWidth: 6,
            },
            blue: {
              key: "blue",
              color: "#003088",
              opacity: 0.8,
              lineWidth: 6,
            },
            yellow: {
              key: "yellow",
              color: "#e68f00",
              opacity: 0.8,
              lineWidth: 6,
            },
            grey: {
              key: "grey",
              color: "#808080",
              opacity: 0.8,
              lineWidth: 6,
            },
          },
        },
      });
      setChessground(newChessground);
    }

    return () => {
      if (chessground) {
        chessground.destroy();
        setChessground(null);
      }
    };
  }, [config]);

  useEffect(() => {
    if (chessground) {
      chessground.set({
        orientation: chessgroundOrientation,
        drawable: {
          autoShapes: [],
          shapes: [],
        },
      });
    }
  }, [chessgroundOrientation, chessground]);

  return {
    config,
    setConfig,
    chessground,
    ref,
  };
};
