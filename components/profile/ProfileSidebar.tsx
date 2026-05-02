"use client";

import { ShoppingBag, Heart, User, Shield, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoutDialog } from "./LogoutDialog";
import type { ProfileTab } from "@/hooks/useProfileTabs";
import { useProfile } from "@/hooks/queries/useProfile";

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  getTabHref: (tab: ProfileTab) => string;
  sidebarItemClass: (tab: ProfileTab) => string;
  onLogout: (allDevices: boolean) => void;
  isLoggingOut: boolean;
}

export function ProfileSidebar({
  activeTab,
  getTabHref,
  sidebarItemClass,
  onLogout,
  isLoggingOut,
}: ProfileSidebarProps) {
  const t = useTranslations("Auth");
  const { data: profile } = useProfile();
  const isSocialiteAccount = profile?.data?.socialite_account === true;
  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <nav className="space-y-1">
        <Link className={sidebarItemClass("profile")} href={getTabHref("profile")}>
          <User className="w-5 h-5" />
          {t("profile.sidebar.manageProfile")}
        </Link>
        {!isSocialiteAccount && (
          <Link className={sidebarItemClass("change-password")} href={getTabHref("change-password")}>
          <Shield className="w-5 h-5" />
          {t("profile.sidebar.changePassword")}
          </Link>
        )}
        <hr className="border-slate-200 dark:border-slate-800" />
        <Link className={sidebarItemClass("orders")} href={getTabHref("orders")}>
          <ShoppingBag className="w-5 h-5" />
          {t("profile.sidebar.orders")}
        </Link>
        <Link className={sidebarItemClass("wishlist")} href={getTabHref("wishlist")}>
          <Heart className="w-5 h-5" />
          {t("profile.sidebar.wishlist")}
        </Link>
        <hr className="border-slate-200 dark:border-slate-800" />

        <div className="mt-4">
          <LogoutDialog
            onLogout={onLogout}
            isLoggingOut={isLoggingOut}
            trigger={
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {t("profile.sidebar.signOut")}
              </button>
            }
          />
        </div>
      </nav>
    </aside>
  );
}

