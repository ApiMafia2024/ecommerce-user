"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, Cpu, User, Mail, Phone, Lock, AlertCircle } from "lucide-react";
import { FormInput, Alert } from "@/components/ui";
import { createRegisterSchema, RegisterFormData } from "@/validations/auth.validations";
import { useRegisterMutation, useSendOtpMutation } from "@/hooks/mutations/useAuthMutations";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
import { useTranslations } from "next-intl";
import { useSettingsContext } from "@/contexts/SettingsContext";

import { Link, useRouter } from "@/i18n/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const v = useTranslations("Validation");
  const c = useTranslations("Common");
  const { siteLogo, siteName } = useSettingsContext();

  // Common phone country codes (localized)
  const phoneCountries = [
    { value: "EG", label: t("register.phoneCountries.EG") },
    { value: "US", label: t("register.phoneCountries.US") },
    { value: "GB", label: t("register.phoneCountries.GB") },
    { value: "SA", label: t("register.phoneCountries.SA") },
    { value: "AE", label: t("register.phoneCountries.AE") },
    { value: "KW", label: t("register.phoneCountries.KW") },
    { value: "QA", label: t("register.phoneCountries.QA") },
    { value: "JO", label: t("register.phoneCountries.JO") },
    { value: "LB", label: t("register.phoneCountries.LB") },
  ];

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(createRegisterSchema(v)),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_country: "EG",
      terms_and_conditions: false,
    },
  });

  const { alert, handleError, handleSuccess, clearAlert } = useFormErrorHandler<RegisterFormData>(setError, {
    validationBanner: c("formErrors.validationBanner"),
    genericError: c("formErrors.genericError"),
    unexpectedError: c("formErrors.unexpectedError"),
  });

  // Send OTP mutation
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtpMutation({
    onSuccess: () => {
      handleSuccess(t("register.successRedirectVerify"));
      setTimeout(() => {
        router.push("/auth/verify");
      }, 1500);
    },
    onError: (error) => {
      // Even if OTP fails, registration succeeded, so still redirect
      console.error("Failed to send OTP:", error);
      handleSuccess(t("register.successVerify"));
      setTimeout(() => {
        router.push("/auth/verify");
      }, 1500);
    },
  });

  // Register mutation
  const { mutate: registerUser, isPending: isRegistering } = useRegisterMutation({
    onSuccess: () => {
      // Store email in sessionStorage for verify page
      const email = watch("email");
      sessionStorage.setItem("verify_email", email);

      // Send OTP
      sendOtp({ email });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const isPending = isRegistering || isSendingOtp;

  const onSubmit = (data: RegisterFormData) => {
    clearAlert();
    registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-12">
          <Link href="/" className="flex items-center space-x-4">
            {siteLogo ? (
              <div className="relative w-12 h-12">
                <Image
                  src={siteLogo}
                  alt={siteName || 'Logo'}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="bg-blue-600 p-2 rounded-xl">
                <Cpu className="text-white w-8 h-8" />
              </div>
            )}
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {siteName || 'API Tech'}
            </span>
          </Link>
          <div className="space-y-4">
            <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {t("register.branding.titlePrefix")}{" "}
              <br />
              <span className="text-blue-600">{t("register.branding.titleHighlight")}</span>
            </h2>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:col-span-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 lg:p-10 border border-slate-200 dark:border-slate-700">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t("register.title")}</h2>
              <p className="text-slate-500 dark:text-slate-400">{t("register.subtitle")}</p>
            </div>

            {/* Alert Banner */}
            {alert.isVisible && (
              <div className="mb-6">
                <Alert
                  variant={alert.variant}
                  message={alert.message}
                  onClose={clearAlert}
                  autoDismiss={alert.variant === "success"}
                  dismissAfter={3000}
                />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label={t("register.form.firstNameLabel")}
                  id="first_name"
                  placeholder={t("register.form.firstNamePlaceholder")}
                  leftIcon={User}
                  error={errors.first_name}
                  {...register("first_name")}
                />
                <FormInput
                  label={t("register.form.lastNameLabel")}
                  id="last_name"
                  placeholder={t("register.form.lastNamePlaceholder")}
                  leftIcon={User}
                  error={errors.last_name}
                  {...register("last_name")}
                />
              </div>

              {/* Email */}
              <FormInput
                type="email"
                label={t("register.form.emailLabel")}
                id="email"
                placeholder={t("register.form.emailPlaceholder")}
                leftIcon={Mail}
                error={errors.email}
                {...register("email")}
              />

              {/* Phone with Country Code */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t("register.form.phoneLabel")}
                </label>
                <div className={`flex items-center rounded-md border relative overflow-hidden focus-within:ring-0 focus-within:border-slate-200 dark:focus-within:border-slate-700 ${errors.phone || errors.phone_country
                  ? "border-red-500 "
                  : "border-slate-200 dark:border-slate-700"
                  }`}>
                  <div className="w-[110px] md:w-[130px] flex-shrink-0 border-r border-slate-200 dark:border-slate-700 focus-within:ring-0">
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
                  <div className="flex-1 focus-within:ring-0">
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

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  type="password"
                  label={t("register.form.passwordLabel")}
                  id="password"
                  placeholder="••••••••"
                  leftIcon={Lock}
                  showPasswordToggle
                  error={errors.password}
                  helperText={t("register.form.passwordHelper")}
                  {...register("password")}
                />
                <FormInput
                  type="password"
                  label={t("register.form.confirmPasswordLabel")}
                  id="password_confirmation"
                  placeholder="••••••••"
                  leftIcon={Lock}
                  showPasswordToggle
                  error={errors.password_confirmation}
                  {...register("password_confirmation")}
                />
              </div>

              {/* Terms Checkbox */}
              <FormInput
                type="checkbox"
                id="terms_and_conditions"
                label={
                  <>
                    {t("register.terms.prefix")}{" "}
                    <Link className="text-blue-600 hover:underline" href="/terms">
                      {t("register.terms.termsOfService")}
                    </Link>{" "}
                  </>
                }
                error={errors.terms_and_conditions}
                {...register("terms_and_conditions")}
              />

              {/* Submit Button */}
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isRegistering ? t("register.creatingAccount") : t("register.sendingVerification")}
                  </>
                ) : (
                  t("register.createAccount")
                )}
              </button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                {t("register.haveAccount")}{" "}
                <Link className="text-blue-600 font-bold hover:underline" href="/auth/login">
                  {t("register.loginHere")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
