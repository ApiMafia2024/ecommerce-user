import { AlertCircle, Phone } from "lucide-react";
import { FormInput } from "../ui";
import { useTranslations } from "next-intl";
import { usePhoneCountries } from "@/hooks/usePhoneCountries";

export function PhoneInput({ register, errors, watch, className }: any) {
    const t = useTranslations("Auth");
    const phoneCountries = usePhoneCountries();

    return (
        <div >
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t("register.form.phoneLabel")}
            </label>
            <div className={`flex items-center rounded-md border relative overflow-hidden focus-within:ring-0 focus-within:border-slate-200 dark:focus-within:border-slate-700 ${errors.phone || errors.phone_country
                ? "border-red-500 "
                : "border-slate-200 dark:border-slate-700"
                }`}>
                <div className={`${className ? className : "w-[35%] md:w-[40%]"} flex-shrink-0 border-r border-slate-200 dark:border-slate-700 focus-within:ring-0`}>
                    <FormInput
                        type="select"
                        id="phone_country"
                        options={phoneCountries}
                        error={undefined}
                        {...register("phone_country")}
                        value={watch("phone_country")}
                        inputClassName="border-0 shadow-none bg-transparent outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                    />
                </div>
                <div className="flex-1 focus-within:ring-0 !w-[60%] !md:w-[65%]">
                    <FormInput
                        type="tel"
                        id="phone"
                        placeholder={t("register.form.phonePlaceholder")}
                        leftIcon={Phone}
                        error={undefined}
                        {...register("phone")}
                        inputClassName="border-0 shadow-none bg-transparent outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
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