"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { createResetPasswordSchema, ResetPasswordFormData } from "@/validations/auth.validations";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormInput, Alert } from "@/components/ui";
import { useResetPasswordMutation } from "@/hooks/mutations/useAuthMutations";
import { Loader2, Cpu, LockKeyhole, CheckCircle2, Circle, KeyRound, Lock } from "lucide-react";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/i18n/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const v = useTranslations("Validation");
  const c = useTranslations("Common");

  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");

  // Get email from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('resetPasswordEmail');
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        // If no email found, redirect to forgot-password
        router.push("/auth/forgot-password");
      }
    }
  }, [router]);

  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(createResetPasswordSchema(v)),
  });

  // Watch password field for strength calculation
  const watchedPassword = watch("password", "");
  useEffect(() => {
    setPassword(watchedPassword);
  }, [watchedPassword]);

  const { alert, handleError, handleSuccess, clearAlert } = useFormErrorHandler<ResetPasswordFormData>(setError, {
    validationBanner: c("formErrors.validationBanner"),
    genericError: c("formErrors.genericError"),
    unexpectedError: c("formErrors.unexpectedError"),
  });

  const { mutate, isPending } = useResetPasswordMutation({
    onSuccess: () => {
      // Clear email from localStorage after successful reset
      if (typeof window !== 'undefined') {
        localStorage.removeItem('resetPasswordEmail');
      }
      handleSuccess(t("resetPassword.successRedirectLogin"));
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    clearAlert(); // Clear any previous alerts
    if (!email) {
      handleError(new Error(t("resetPassword.emailNotFound")));
      return;
    }
    mutate({
      email: email,
      otp: data.otp,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthLabels = [
    t("resetPassword.strength.weak"),
    t("resetPassword.strength.fair"),
    t("resetPassword.strength.good"),
    t("resetPassword.strength.strong"),
  ];
  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  return (
    <>
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">API Tech</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full mb-4">
                <LockKeyhole className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t("resetPassword.title")}</h1>
              <p className="text-slate-500 dark:text-slate-400">
                {t("resetPassword.subtitle")}
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
              {/* OTP Field */}
              <FormInput
                label={t("resetPassword.form.otpLabel")}
                id="otp"
                placeholder={t("resetPassword.form.otpPlaceholder")}
                leftIcon={KeyRound}
                type="text"
                error={errors.otp}
                {...register("otp")}
              />
              {/* New Password */}
              <div>
                <FormInput
                  label={t("resetPassword.form.newPasswordLabel")}
                  id="password"
                  placeholder="••••••••"
                  leftIcon={Lock}
                  type="password"
                  showPasswordToggle
                  error={errors.password}
                  {...register("password")}
                />

                {/* Strength Meter */}
                {password && (
                  <div className="mt-3">
                    <div className="flex gap-1 mb-2">
                      {[0, 1, 2, 3].map((index) => {
                        const strength = getPasswordStrength();
                        return (
                          <div
                            key={index}
                            className={`h-1 flex-1 rounded ${
                              index < strength ? strengthColors[strength - 1] : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      {t("resetPassword.passwordStrength")}{" "}
                      <span
                        className={`font-semibold ${
                          getPasswordStrength() === 4
                            ? "text-green-600 dark:text-green-400"
                            : getPasswordStrength() >= 2
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {password.length > 0 ? strengthLabels[getPasswordStrength() - 1] || strengthLabels[0] : "—"}
                      </span>
                    </p>
                  </div>
                )}

                {/* Requirements List */}
                {password && (
                  <div className="mt-4 grid grid-cols-2 gap-y-2">
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        password.length >= 8
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {password.length >= 8 ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      {t("resetPassword.requirements.minChars")}
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        /[0-9]/.test(password)
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {/[0-9]/.test(password) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      {t("resetPassword.requirements.oneNumber")}
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        /[A-Z]/.test(password) && /[a-z]/.test(password)
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {/[A-Z]/.test(password) && /[a-z]/.test(password) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      {t("resetPassword.requirements.upperLower")}
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        /[^A-Za-z0-9]/.test(password)
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {/[^A-Za-z0-9]/.test(password) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      {t("resetPassword.requirements.specialSymbol")}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <FormInput
                label={t("resetPassword.form.confirmNewPasswordLabel")}
                id="password_confirmation"
                placeholder="••••••••"
                leftIcon={Lock}
                type="password"
                showPasswordToggle
                error={errors.password_confirmation}
                {...register("password_confirmation")}
              />

              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-blue-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {t("resetPassword.resetting")}
                  </>
                ) : (
                  t("resetPassword.resetPassword")
                )}
              </button>

              <Link
                className="block text-center text-sm font-medium text-blue-500 hover:underline"
                href="/auth/login"
              >
                {t("resetPassword.backToSignIn")}
              </Link>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("resetPassword.havingTrouble")}{" "}
              <Link className="text-blue-500 font-medium" href="#">
                {t("resetPassword.contactSupport")}
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("resetPassword.footer.copyright", { year: currentYear })}</p>
          <div className="flex gap-6">
            <Link
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors"
              href="/terms"
            >
              {t("resetPassword.footer.privacyPolicy")}
            </Link>
            <Link
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors"
              href="/terms"
            >
              {t("resetPassword.footer.termsOfService")}
            </Link>
            <Link
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors"
              href="#"
            >
              {t("resetPassword.footer.helpCenter")}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

