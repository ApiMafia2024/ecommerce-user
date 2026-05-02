import { useMemo } from "react";
import { useTranslations } from "next-intl";
import ReactCountryFlag from "react-country-flag";

export function usePhoneCountries() {
  const t = useTranslations("Auth");

  const phoneCountries = useMemo(() => {
    return [
      {
        value: "EG",
        label: (
          <span className="flex items-center gap-2">
            <ReactCountryFlag countryCode="EG" svg className="w-4 h-4" />
            {t("register.phoneCountries.EG")}
          </span>
        ),
        countryCode: "EG",
      },
      {
        value: "US",
        label: (
          <span className="flex items-center gap-2">
            <ReactCountryFlag countryCode="US" svg className="w-4 h-4" />
            {t("register.phoneCountries.US")}
          </span>
        ),
        countryCode: "US",
      },
      {
        value: "GB",
        label: (
          <span className="flex items-center gap-2">
            <ReactCountryFlag countryCode="GB" svg className="w-4 h-4" />
            {t("register.phoneCountries.GB")}
          </span>
        ),
        countryCode: "GB",
      },
      {
        value: "SA",
        label: (
          <span className="flex items-center gap-2">
            <ReactCountryFlag countryCode="SA" svg className="w-4 h-4" />
            {t("register.phoneCountries.SA")}
          </span>
        ),
        countryCode: "SA",
      },
      {
        value: "AE",
        label: (
          <span className="flex items-center gap-2">
            <ReactCountryFlag countryCode="AE" svg className="w-4 h-4" />
            {t("register.phoneCountries.AE")}
          </span>
        ),
        countryCode: "AE",
      },
      {
        value: "KW",
        label: (
          <span className="flex items-center gap-2">
            <ReactCountryFlag countryCode="KW" svg className="w-4 h-4" />
            {t("register.phoneCountries.KW")}
          </span>
        ),
        countryCode: "KW",
      },
      {
        value: "QA",
        label: (
          <span className="flex items-center gap-2">
            <ReactCountryFlag countryCode="QA" svg className="w-4 h-4" />
            {t("register.phoneCountries.QA")}
          </span>
        ),
        countryCode: "QA",
      },
      {
        value: "JO",
        label: (
          <span className="flex items-center gap-2">
            <ReactCountryFlag countryCode="JO" svg className="w-4 h-4" />
            {t("register.phoneCountries.JO")}
          </span>
        ),
        countryCode: "JO",
      },
    ];
  }, [t]);

  return phoneCountries;
}

