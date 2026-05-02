import { useSearchParams } from "next/navigation";

export type ProfileTab = "profile" | "change-password" | "orders" | "wishlist";

export function useProfileTabs() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: ProfileTab =
    tabParam === "change-password" || tabParam === "orders" || tabParam === "wishlist"
      ? tabParam
      : "profile";

  const getTabHref = (tab: ProfileTab) =>
    tab === "profile" ? "/auth/profile" : `/auth/profile?tab=${tab}`;

  const sidebarItemClass = (tab: ProfileTab) =>
    tab === activeTab
      ? "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
      : "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

  const tabTriggerClass = (tab: ProfileTab) =>
    tab === activeTab
      ? "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-sm"
      : "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

  return {
    activeTab,
    getTabHref,
    sidebarItemClass,
    tabTriggerClass,
  };
}

