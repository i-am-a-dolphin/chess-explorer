"use client";

import { LanguagesIcon } from "lucide-react";
import { useLocale } from "next-intl";

import { Button } from "@/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";

export const LanguageDropdown = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = (locale: string) => {
    router.push(pathname, { locale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <LanguagesIcon className="size-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale("ko")}>
          <span className={locale === "ko" ? "font-bold" : ""}>한국어</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("en")}>
          <span className={locale === "en" ? "font-bold" : ""}>English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
