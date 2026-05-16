import { AlertCircle } from "lucide-react";
import { FormInput } from "../ui";
import { useTranslations } from "next-intl";
import { usePhoneCountries } from "@/hooks/usePhoneCountries";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PhoneInput({ register, errors, watch, className }: any) {
    const t = useTranslations("Auth");
    const phoneCountries = usePhoneCountries();

    return (
        <div >
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t("register.form.phoneLabel")}
            </label>
            <div className={`flex items-center relative overflow-hidden focus-within:ring-0 rounded-lg bg-white dark:bg-transparent ${errors.phone || errors.phone_country
                ? "border border-red-500"
                : "border border-slate-200 dark:border-transparent"
                }`}>
                <div className={`${className ? className : "w-[35%] md:w-[40%]"} flex-shrink-0 focus-within:ring-0`}>
                    <FormInput
                        type="select"
                        id="phone_country"
                        options={phoneCountries}
                        error={undefined}
                        {...register("phone_country")}
                        value={watch("phone_country") || "EG"}
                        inputClassName="rounded-r-none shadow-none bg-transparent outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border-0"
                    />
                </div>
                <div className="flex-1 focus-within:ring-0 w-[60%]! md:w-[65%]!">
                    <FormInput
                        type="tel"
                        id="phone"
                        placeholder={t("register.form.phonePlaceholder")}
                        error={undefined}
                        {...register("phone")}
                        inputClassName="rounded-l-none! border-0 shadow-none bg-transparent outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                    />
                </div>
            </div>
            {(errors.phone || errors.phone_country) && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone?.message || errors.phone_country?.message}
                </p>
            )}
        </div>
    )
}