import { GithubIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-16 border-t pt-8 pb-4">
      <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/i-am-a-dolphin/chess-explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <GithubIcon className="size-4" />
            <span>{t("github")}</span>
          </a>
        </div>
        <div className="text-xs">
          <p>{t("description")}</p>
          <p className="mt-1">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
