"use client";

import { useMounted } from "@mantine/hooks";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";

export function ColorSchemeDropdown() {
  const { theme: colorScheme, setTheme: setColorScheme } = useTheme();
  const mounted = useMounted();

  const getIcon = () => {
    switch (colorScheme) {
      case "dark":
        return <MoonIcon className="size-4" />;
      case "light":
        return <SunIcon className="size-4" />;
      default:
        return <SunMoonIcon className="size-4" />;
    }
  };

  if (!mounted) {
    return (
      <Button size="icon" variant="outline" disabled>
        <SunIcon className="size-4" />
        <span className="sr-only">Select color scheme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          {getIcon()}
          <span className="sr-only">Select color scheme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setColorScheme("light")}>
          <span className={colorScheme === "light" ? "font-bold" : ""}>
            Light
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorScheme("dark")}>
          <span className={colorScheme === "dark" ? "font-bold" : ""}>
            Dark
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorScheme("system")}>
          <span className={colorScheme === "system" ? "font-bold" : ""}>
            System
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
