"use client";

import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

// ============================================
// Types
// ============================================

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  message: string;
  onClose?: () => void;
  autoDismiss?: boolean;
  dismissAfter?: number; // in milliseconds
  className?: string;
}

// ============================================
// Alert Component
// ============================================

export const Alert = ({
  variant = "info",
  message,
  onClose,
  autoDismiss = false,
  dismissAfter = 5000,
  className = "",
}: AlertProps) => {
  const t = useTranslations("Alert");
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Trigger enter animation after mount
  useEffect(() => {
    // Small delay to ensure the initial hidden state is rendered first
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Wait for exit transition before calling onClose
    setTimeout(() => {
      setIsMounted(false);
      onClose?.();
    }, 300); // Match transition duration
  }, [onClose]);

  useEffect(() => {
    if (autoDismiss && dismissAfter > 0 && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, dismissAfter);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, handleClose, isVisible]);

  if (!isMounted) return null;

  // Variant configurations
  const variantConfig = {
    success: {
      container:
        "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-800 dark:text-emerald-200",
      Icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    error: {
      container:
        "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      Icon: AlertCircle,
      iconColor: "text-red-600 dark:text-red-400",
    },
    warning: {
      container:
        "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
      text: "text-amber-800 dark:text-amber-200",
      Icon: AlertTriangle,
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    info: {
      container:
        "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-200",
      Icon: Info,
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  };

  const config = variantConfig[variant];

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border
        ${config.container}
        ${className}
        transition-all duration-300 ease-in-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-2 pointer-events-none'
        }
      `}
      role="alert"
    >
      {/* Icon */}
      <config.Icon
        className={`w-5 h-5 ${config.iconColor} shrink-0`}
      />

      {/* Message */}
      <div className={`flex-1 text-sm font-medium ${config.text}`}>
        {message}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`
          shrink-0 rounded-lg p-1 
          transition-colors duration-200
          hover:bg-black/5 dark:hover:bg-white/5
          ${config.text}
        `}
        aria-label={t("close")}
        type="button"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

Alert.displayName = "Alert";

export default Alert;

