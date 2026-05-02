"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";

interface LogoutDialogProps {
  onLogout: (allDevices: boolean) => void;
  isLoggingOut: boolean;
  trigger: React.ReactNode;
}

export function LogoutDialog({ onLogout, isLoggingOut, trigger }: LogoutDialogProps) {
  const t = useTranslations("Auth");
  const [logoutScope, setLogoutScope] = useState<"single" | "all">("single");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="max-w-[520px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-white">
            {t("logout.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("logout.subtitle")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-5 flex flex-col gap-4">
          <label
            className={`group relative flex cursor-pointer items-start gap-4 rounded-xl border ${
              logoutScope === "single"
                ? "border-blue-600/50 bg-blue-600/5"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30"
            } p-4 transition-all hover:border-blue-600/50 hover:bg-blue-600/5`}
          >
            <input
              checked={logoutScope === "single"}
              onChange={() => setLogoutScope("single")}
              className="mt-1 h-5 w-5 border-2 border-slate-300 dark:border-slate-700 bg-transparent text-blue-600 focus:ring-blue-600 focus:ring-offset-white dark:focus:ring-offset-slate-900"
              name="logout_scope"
              type="radio"
              disabled={isLoggingOut}
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide mb-1 text-slate-900 dark:text-white">
                {t("logout.options.thisDevice.title")}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t("logout.options.thisDevice.description")}
              </span>
            </div>
          </label>

          <label
            className={`group relative flex cursor-pointer items-start gap-4 rounded-xl border ${
              logoutScope === "all"
                ? "border-blue-600/50 bg-blue-600/5"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30"
            } p-4 transition-all hover:border-blue-600/50 hover:bg-blue-600/5`}
          >
            <input
              checked={logoutScope === "all"}
              onChange={() => setLogoutScope("all")}
              className="mt-1 h-5 w-5 border-2 border-slate-300 dark:border-slate-700 bg-transparent text-blue-600 focus:ring-blue-600 focus:ring-offset-white dark:focus:ring-offset-slate-900"
              name="logout_scope"
              type="radio"
              disabled={isLoggingOut}
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide mb-1 text-slate-900 dark:text-white">
                {t("logout.options.allDevices.title")}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t("logout.options.allDevices.description")}
              </span>
            </div>
          </label>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel disabled={isLoggingOut}>
            {t("logout.cancelStayLoggedIn")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoggingOut}
            onClick={(e) => {
              e.preventDefault();
              onLogout(logoutScope === "all");
            }}
          >
            {isLoggingOut ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("logout.signingOut")}
              </span>
            ) : (
              t("logout.confirmLogout")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

