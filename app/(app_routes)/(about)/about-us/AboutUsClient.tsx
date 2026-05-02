"use client";

import {
  Code2,
  Eye,
  Rocket,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useAbouts } from "@/hooks/queries/useAbouts";
import Loading from "@/app/loading";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import Footer from "@/components/shared/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from "@/components/ui";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function AboutUsClient() {
  const { data: abouts, isLoading, error } = useAbouts();
  const t = useTranslations("AboutUs");

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="max-w-[1280px] mx-auto px-4 lg:px-20 py-10">
        <Breadcrumbs
          items={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("breadcrumbs.aboutUs") }]}
          className="mb-8"
        />

        {/* Hero */}
        <section aria-labelledby="about-hero" className="mb-14">
          <div className="relative overflow-hidden rounded-2xl border border-[#e8edf2] dark:border-[#3a3f45] bg-slate-950 min-h-[520px] flex items-center p-6 sm:p-10 lg:p-14">
            <div className="absolute inset-0">
              <img
                alt={t("hero.imageAlt")}
                className="w-full h-full object-cover opacity-35 grayscale"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ2X2wW1r4t0UgAKOqx95yMrsDVFv13x9Yg8VC-J5rANf057DSGVHVU0wE31droLv1cCrCqwkRjePuSRFPW6lc27yZ0mGUGwHOmBIOxowJhV13klIEtxJXE2hvGdSt1aR8jCDpEZdnS9sjc3VO5dY5sREUyhNj67lABIEFTKCvdAmj3hjlNMFWvZZklZ3PcyD9QOpNmZlIYrkDhANsXR1T7kTiqNY1pFbDW3-yqhLbQGoyKI87RkWeefBgvDMpIiKPDBITkpdA-A"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
            </div>

            <div className="relative z-10 max-w-2xl flex flex-col gap-6">
              <h1
                id="about-hero"
                className="text-white text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight"
              >
                {t("hero.title")}
              </h1>
              <p className="text-slate-300 text-lg lg:text-xl font-light max-w-lg">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button asChild className="h-12 px-8 rounded-xl font-bold text-base">
                  <Link href="/contact">{t("hero.contactCta")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section
          aria-label={t("stats.ariaLabel")}
          className="mb-14 bg-white dark:bg-[#2d3439] rounded-2xl border border-[#e8edf2] dark:border-[#3a424a] p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: t("stats.enterpriseClients") },
              { value: "99.9%", label: t("stats.uptimeSla") },
              { value: "24/7", label: t("stats.expertSupport") },
              { value: "15+", label: t("stats.globalRegions") },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <span className="text-primary font-extrabold text-4xl mb-1">
                  {stat.value}
                </span>
                <span className="text-[#4e8597] dark:text-gray-400 text-sm font-semibold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* About content from API */}
        <section className="mb-14">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary/10 px-3 py-1 rounded-full">
                  {t("aboutSection.tag")}
                </span>
                <h2 className="mt-4 text-[#0e181b] dark:text-white text-3xl lg:text-4xl font-extrabold leading-tight">
                  {t("aboutSection.title")}
                </h2>
                <p className="mt-3 text-[#4e8597] dark:text-gray-400 text-lg leading-relaxed">
                  {t("aboutSection.subtitle")}
                </p>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 p-4">
                <p className="text-sm font-bold text-red-800 dark:text-red-200">
                  {t("aboutSection.errorTitle")}
                </p>
                <p className="text-xs mt-1 text-red-700/80 dark:text-red-200/80">
                  {t("aboutSection.errorSubtitle")}
                </p>
              </div>
            ) : null}

            {!error && (!abouts || abouts.length === 0) ? (
              <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
                {t("aboutSection.empty")}
              </p>
            ) : (
              <div className="mt-8">
                <Accordion type="multiple" className="space-y-4">
                  {abouts?.map((item) => (
                    <AccordionItem key={item.id} value={`about-${item.id}`}>
                      <AccordionTrigger>{item.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{item.description}</p>

                          {item.images && item.images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {item.images.map((img, idx) => (
                                <div
                                  key={`${item.id}-${idx}`}
                                  className="relative overflow-hidden rounded-xl border border-[#e8edf2] dark:border-[#3a3f45] bg-white/60 dark:bg-[#2d3439]"
                                >
                                  <img
                                    src={img.original}
                                    alt={t("aboutSection.imageAlt", { title: item.title, number: idx + 1 })}
                                    className="w-full h-32 object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="mb-14">
          <div className="flex flex-col gap-4 mb-8">
            <h2 className="text-3xl font-extrabold text-[#0e181b] dark:text-white">
              {t("visionPurpose.title")}
            </h2>
            <p className="text-[#4e8597] dark:text-gray-400 max-w-2xl">
              {t("visionPurpose.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7 bg-white dark:bg-[#2d3439] p-8 rounded-2xl border border-[#e8edf2] dark:border-[#3a424a] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Eye className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#0e181b] dark:text-white">
                  {t("visionPurpose.visionTitle")}
                </h3>
                <p className="text-[#4e8597] dark:text-gray-400 text-lg leading-relaxed">
                  {t("visionPurpose.visionDescription")}
                </p>
              </div>

              {/* <div className="mt-8 h-32 w-full rounded-xl bg-primary/5 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-end p-4">
                  <span className="text-primary/40 font-black text-6xl tracking-tighter opacity-20">
                    FUTURE
                  </span>
                </div>
              </div> */}
            </div>

            <div className="col-span-12 lg:col-span-5 bg-primary p-8 rounded-2xl flex flex-col gap-4 text-white hover:brightness-110 transition-all">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">{t("visionPurpose.missionTitle")}</h3>
              <p className="text-white/80 leading-relaxed">
                {t("visionPurpose.missionDescription")}
              </p>
{/* 
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  "Reliability at Scale",
                  "Developer-First Experience",
                  "Global Connectivity",
                ].map((bullet) => (
                  <li key={bullet} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-white/70" />
                    <span className="font-semibold">{bullet}</span>
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-14">
          <div className="bg-[#eef5f7] dark:bg-white/5 rounded-2xl p-8 lg:p-12 border border-[#e8edf2] dark:border-[#3a424a]">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold mb-3 text-[#0e181b] dark:text-white">
                {t("whyPartner.title")}
              </h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: t("whyPartner.cards.securityFirst.title"),
                  description: t("whyPartner.cards.securityFirst.description"),
                },
                {
                  icon: Code2,
                  title: t("whyPartner.cards.developerCentric.title"),
                  description: t("whyPartner.cards.developerCentric.description"),
                },
                {
                  icon: Zap,
                  title: t("whyPartner.cards.highPerformance.title"),
                  description: t("whyPartner.cards.highPerformance.description"),
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="flex flex-col gap-4 p-6 bg-white dark:bg-[#2d3439] rounded-2xl shadow-sm border border-transparent hover:border-primary/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="text-primary w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-lg text-[#0e181b] dark:text-white">
                      {card.title}
                    </h4>
                    <p className="text-[#4e8597] dark:text-gray-400 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="pb-8">
          <div className="flex flex-col items-center gap-8">
            <p className="text-gray-400 font-semibold tracking-widest text-xs uppercase">
              {t("trust.title")}
            </p>
            <div className="flex flex-wrap justify-center gap-10 lg:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all select-none">
              {["ORION", "NEXUS", "VELOCITY", "PRISM", "LUMINA"].map((name) => (
                <span
                  key={name}
                  className="text-2xl font-black text-[#0e181b] dark:text-white tracking-tighter"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

