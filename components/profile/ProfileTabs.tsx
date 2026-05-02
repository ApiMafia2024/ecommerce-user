"use client";

import { ShoppingBag, Heart, User, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ProfileTab } from "@/hooks/useProfileTabs";
import { useProfile } from "@/hooks/queries/useProfile";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  getTabHref: (tab: ProfileTab) => string;
  tabTriggerClass: (tab: ProfileTab) => string;
}

export function ProfileTabs({ activeTab, getTabHref, tabTriggerClass }: ProfileTabsProps) {
  const t = useTranslations("Auth");
  const { data: profile } = useProfile();
  const isSocialiteAccount = profile?.data?.socialite_account === true;
  return (
    <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <Link className={tabTriggerClass("profile")} href={getTabHref("profile")}>
          <User className="w-4 h-4" />
          {t("profile.sidebar.manageProfile")}
        </Link>
        {!isSocialiteAccount && (
          <Link className={tabTriggerClass("change-password")} href={getTabHref("change-password")}>
          <Shield className="w-4 h-4" />
          {t("profile.sidebar.changePassword")}
          </Link>
        )}
        <Link className={tabTriggerClass("orders")} href={getTabHref("orders")}>
          <ShoppingBag className="w-4 h-4" />
          {t("profile.sidebar.orders")}
        </Link>
        <Link className={tabTriggerClass("wishlist")} href={getTabHref("wishlist")}>
          <Heart className="w-4 h-4" />
          {t("profile.sidebar.wishlist")}
        </Link>
      </div>
    </div>
  );
}

