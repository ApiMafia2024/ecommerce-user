"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { createForgotPasswordSchema, ForgotPasswordFormData } from "@/validations/auth.validations";
import { useForm } from "react-hook-form";
import { FormInput, Alert } from "@/components/ui";
import { useSendOtpMutation } from "@/hooks/mutations/useAuthMutations";
import { Loader2, Cpu, Lock, Key, CheckCircle2, Shield, Headphones, Mail } from "lucide-react";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/i18n/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const v = useTranslations("Validation");
  const c = useTranslations("Common");

  const currentYear = new Date().getFullYear();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(createForgotPasswordSchema(v)),
  });

  const { alert, handleError, handleSuccess, clearAlert } = useFormErrorHandler<ForgotPasswordFormData>(setError, {
    validationBanner: c("formErrors.validationBanner"),
    genericError: c("formErrors.genericError"),
    unexpectedError: c("formErrors.unexpectedError"),
  });

  const { mutate, isPending } = useSendOtpMutation({
    onSuccess: (_, variables) => {
      // Save email to localStorage for reset password page
      if (typeof window !== 'undefined') {
        localStorage.setItem('resetPasswordEmail', variables.email);
      }
      handleSuccess(t("forgotPassword.otpSentRedirect"));
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/auth/reset-password");
      }, 1500);
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    clearAlert(); // Clear any previous alerts
    mutate({ email: data.email });
  };

  return (
    <>
      {/* Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">API Tech</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
            <Lock className="w-4 h-4" />
            <span>{t("forgotPassword.secureServer")}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow max-w-7xl mx-auto grid grid-cols-1 gap-12 px-8 py-16 items-start">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="mb-8">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
              <Key className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t("forgotPassword.title")}</h1>
            <p className="text-slate-500 dark:text-slate-400">
              {t("forgotPassword.subtitle")}
            </p>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label={t("forgotPassword.form.emailLabel")}
              id="email"
              placeholder={t("forgotPassword.form.emailPlaceholder")}
              leftIcon={Mail}
              type="email"
              error={errors.email}
              {...register("email")}
            />

            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t("forgotPassword.sending")}
                </>
              ) : (
                t("forgotPassword.sendResetCode")
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-slate-500">{t("forgotPassword.remembered")}</span>
              <Link className="text-blue-500 font-semibold hover:underline" href="/auth/login">
                {t("forgotPassword.login")}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

