"use client";

import { useAbouts } from "@/hooks/queries/useAbouts";
import Loading from "@/app/loading";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import Footer from "@/components/shared/Footer";
import { useTranslations } from "next-intl";

import { AboutUsContent } from "@/components/about/AboutUsContent";

export default function AboutUsClient() {
  const { data: abouts, isLoading, error } = useAbouts();
  const t = useTranslations("AboutUs");

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="max-w-[1200px] mx-auto">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-20 py-10">
          <Breadcrumbs
            items={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("breadcrumbs.aboutUs") }]}
            className="mb-8"
          />
        </div>
        
        <AboutUsContent />
      </main>

      <Footer />
    </div>
  );
}

