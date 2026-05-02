"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Cpu, Lock, UserCheck, Timer, CheckCircle2, Shield, Headphones } from "lucide-react";
import { Alert } from "@/components/ui";
import { useCheckOtpMutation, useSendOtpMutation } from "@/hooks/mutations/useAuthMutations";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/i18n/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const currentYear = new Date().getFullYear();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(15 * 60); // 15 minutes in seconds
  // Initialize email from sessionStorage using lazy initializer
  const [email] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem("verify_email");
    }
    return null;
  });
  const [alert, setAlert] = useState<{
    isVisible: boolean;
    variant: "success" | "error" | "warning" | "info";
    message: string;
  }>({ isVisible: false, variant: "info", message: "" });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle redirect if no email found
  useEffect(() => {
    if (!email) {
      router.push("/auth/register");
    }
  }, [email, router]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Mask email for display (e.g., "j***@example.com")
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const clearAlert = () => {
    setAlert({ isVisible: false, variant: "info", message: "" });
  };

  // Check OTP mutation
  const { mutate: checkOtp, isPending: isVerifying } = useCheckOtpMutation({
    onSuccess: () => {
      setAlert({
        isVisible: true,
        variant: "success",
        message: t("verify.successRedirectLogin"),
      });
      // Clear sessionStorage
      sessionStorage.removeItem("verify_email");
      // Redirect to login
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    },
    onError: (error) => {
      setAlert({
        isVisible: true,
        variant: "error",
        message: error.message || t("verify.invalidOtp"),
      });
      // Clear OTP inputs
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  // Resend OTP mutation
  const { mutate: resendOtp, isPending: isResending } = useSendOtpMutation({
    onSuccess: () => {
      setAlert({
        isVisible: true,
        variant: "success",
        message: t("verify.otpSent"),
      });
      setTimer(15 * 60);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
    onError: (error) => {
      setAlert({
        isVisible: true,
        variant: "error",
        message: error.message || t("verify.resendFailed"),
      });
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single alphanumeric character
    if (value && !/^[a-zA-Z0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value
    ; // Convert to uppercase for consistency
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all characters are entered
    if (value && index === 3) {
      const fullOtp = [...newOtp.slice(0, 3), value
        
      ].join("");
      if (fullOtp.length === 4 && email) {
        checkOtp({ email, otp: fullOtp });
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4)
    ;
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 4) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((char) => !char);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[3]?.focus();
      // Auto-submit if all characters pasted
      if (pastedData.length === 4 && email) {
        checkOtp({ email, otp: pastedData });
      }
    }
  };

  const handleResendOtp = () => {
    if (email && timer === 0) {
      resendOtp({ email });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length === 4 && email) {
      checkOtp({ email, otp: fullOtp });
    }
  };

  // Show loading while checking for email
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">API Tech</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
            <Lock className="w-4 h-4" />
            <span>{t("verify.secureServer")}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow max-w-7xl mx-auto grid grid-cols-1 gap-12 px-8 py-16 items-start">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-md mx-auto w-full">
          <div className="mb-8">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t("verify.title")}</h2>
            <p className="text-slate-500 dark:text-slate-400">
              {t("verify.sentCodeTo")}{" "}
              <span className="text-slate-900 dark:text-slate-100 font-medium">{maskEmail(email)}</span>
            </p>
          </div>

          {/* Alert Banner */}
          <div 
            className={`
              mb-6 transition-all duration-300 ease-in-out overflow-hidden
              ${alert.isVisible 
                ? 'opacity-100 max-h-96 translate-y-0' 
                : 'opacity-0 max-h-0 -translate-y-2 pointer-events-none'
              }
            `}
          >
            {alert.isVisible && (
              <Alert
                variant={alert.variant}
                message={alert.message}
                onClose={clearAlert}
                autoDismiss={alert.variant === "success"}
                dismissAfter={3000}
              />
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Inputs */}
            <div className="flex justify-between max-w-xs mx-auto gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="w-16 h-16 text-center text-2xl font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all dark:text-white disabled:opacity-50 uppercase"
                  maxLength={1}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  autoFocus={index === 0}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {/* Timer and Resend */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                <Timer className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300">
                  {formatTime(timer)}
                </span>
              </div>
              <p className="text-sm text-slate-500">
                {t("verify.didNotReceive")}{" "}
                <button
                  className="text-blue-600 font-semibold hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0 || isResending}
                >
                  {isResending ? t("verify.sending") : t("verify.resendOtp")}
                </button>
              </p>
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
              disabled={otp.join("").length !== 4 || isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("verify.verifying")}
                </>
              ) : (
                t("verify.verifyAndProceed")
              )}
            </button>
          </form>

          {/* Change email link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            {t("verify.wrongEmail")}{" "}
            <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
              {t("verify.goBackToRegister")}
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t("verify.footer.officialAuth.title")}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {t("verify.footer.officialAuth.description")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t("verify.footer.encryption.title")}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {t("verify.footer.encryption.description")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Headphones className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t("verify.footer.needHelp.title")}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {t("verify.footer.needHelp.description")}
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-12">
          {t("verify.footer.copyright", { year: currentYear })}
        </p>
      </footer>
    </>
  );
}
