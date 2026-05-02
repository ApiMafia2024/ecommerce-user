"use client";

import { useFaqs } from "@/hooks/queries/useFaqs";
import Loading from "@/app/loading";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import Footer from "@/components/shared/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from "@/components/ui";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function FaqsPage() {
  const { data: faqs, isLoading, error } = useFaqs();
  const t = useTranslations("FaqsPage");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 py-10">
        <Breadcrumbs
          items={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("breadcrumbs.faqs") }]}
          className="mb-8"
        />

        <div className="bg-white dark:bg-[#2d3238] rounded-2xl border border-[#e8edf2] dark:border-[#3a3f45] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f141a] dark:text-white">
              {t("title")}
            </h1>
            <Button asChild variant="link" className="px-0 font-bold">
              <Link href="/contact">{t("contactCta")}</Link>
            </Button>
          </div>

          {error ? (
            <div className="mt-6 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 p-4">
              <p className="text-sm font-bold text-red-800 dark:text-red-200">
                {t("errorTitle")}
              </p>
              <p className="text-xs mt-1 text-red-700/80 dark:text-red-200/80">
                {t("errorSubtitle")}
              </p>
            </div>
          ) : null}

          {!error && (!faqs || faqs.length === 0) ? (
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
              {t("empty")}
            </p>
          ) : (
            <div className="mt-8">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs?.map((faq) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
