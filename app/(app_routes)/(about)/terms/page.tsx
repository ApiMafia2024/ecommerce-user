"use client";

import { Link } from "@/i18n/navigation";
import { Search, UserCircle, Info, Settings, Lock, Copyright, Shield, AlertTriangle, Scale, Download, ChevronRight, Calendar, CheckCircle, Package, FileText } from "lucide-react";
import { useTerms } from "@/hooks/queries/useTerms";
import Loading from "@/app/loading";
import { useLocale, useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("TermsPage");
  const locale = useLocale();
  const { data: terms, isLoading, error } = useTerms({});

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="font-bold text-slate-900 dark:text-white">{t("errorTitle")}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("errorSubtitle")}</p>
        </div>
      </div>
    );
  }

  const effectiveDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date("2023-10-24"));

  return (
    <>
      <main className="flex-1 max-w-[1440px] mx-auto ml-40 w-full px-4  md:px-10 py-8 grid grid-cols-12 gap-8 items-start">
        {/* Main Content Column */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          {/* Breadcrumbs & Heading */}
          <div className="">
            <nav className="flex items-center gap-2 text-sm font-medium mb-6">
              <Link className="text-slate-500 hover:text-blue-600" href="/">
                {t("breadcrumbs.home")}
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <span className="text-slate-900 dark:text-slate-300">{t("breadcrumbs.terms")}</span>
            </nav>
          </div>

          {/* Content Body */}
          <div className=" px-8 md:px-12 rounded-xl mb-12">
           
           {terms?.map((el,i) => {
            return (
              <div key={i} className="mb-12">
              
              <section className="mb-12" id="introduction">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
                  <span className="text-blue-600/40">{i + 1}.</span> {el.title}
                </h2>
                <div className="space-y-4 px-4 md:px-8 text-base leading-loose text-slate-700 dark:text-slate-300">
                  <p>{el.description}</p>
                </div>
              </section>
  
              <hr className="border-slate-200 dark:border-slate-700 mb-12 last:hidden" />
              </div>
            )
           })}
          </div>
        </div>
      </main>
    </>
  );
}

