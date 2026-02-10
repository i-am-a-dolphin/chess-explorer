import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { FaviconSwitcher } from "@/components/favicon-switcher";
import { Button } from "@/components/shadcn-ui/button";
import { GithubIcon, SendIcon } from "lucide-react";

export const Header = async () => {
  const t = await getTranslations("footer");

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <FaviconSwitcher />
          <div className="flex items-baseline gap-4">
            <h1 className="text-lg font-semibold">Chess Explorer</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
              {t("description")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="https://forms.gle/BPr7hToTdPAFjtah7"
              target="_blank"
              rel="noopener noreferrer"
              title={t("contributeTranslation")}
            >
              <SendIcon className="size-3" />
              <span className="text-xs hidden sm:inline">{t("contributeTranslation")}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="https://github.com/tonyjun0315/chess-explorer"
              target="_blank"
              rel="noopener noreferrer"
              title={t("github")}
            >
              <GithubIcon className="size-3" />
              <span className="text-xs hidden sm:inline">{t("github")}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
