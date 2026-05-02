"use client";

import { Cpu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function ProfileFooter() {
  const t = useTranslations("Auth");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 bg-slate-400 rounded-md flex items-center justify-center">
              <Cpu className="text-white w-3 h-3" />
            </div>
            <span className="font-bold text-slate-500">API Tech</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link className="hover:text-blue-600 transition-colors" href="/terms">
              {t("profile.footer.privacyPolicy")}
            </Link>
            <Link className="hover:text-blue-600 transition-colors" href="/terms">
              {t("profile.footer.termsOfService")}
            </Link>
            <Link className="hover:text-blue-600 transition-colors" href="#">
              {t("profile.footer.helpCenter")}
            </Link>
          </div>
          <p className="text-sm text-slate-400">{t("profile.footer.copyright", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}

