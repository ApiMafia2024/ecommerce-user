import { useState, useCallback } from "react";
import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { ApiError } from "@/types/api.types";
import { AlertVariant } from "@/components/ui";

// ============================================
// Types
// ============================================

export interface AlertState {
  message: string;
  variant: AlertVariant;
  isVisible: boolean;
}

export interface UseFormErrorHandlerReturn<T extends FieldValues> {
  alert: AlertState;
  handleError: (error: unknown) => void;
  handleSuccess: (message: string) => void;
  clearAlert: () => void;
}

export type FormErrorHandlerMessages = {
  /** Banner shown when server returns field validation errors */
  validationBanner: string;
  /** Banner shown for generic API errors without field validation */
  genericError: string;
  /** Banner shown for unknown/unexpected errors */
  unexpectedError: string;
};

// ============================================
// Hook
// ============================================

export function useFormErrorHandler<T extends FieldValues>(
  setError: UseFormSetError<T>,
  messages?: Partial<FormErrorHandlerMessages>
): UseFormErrorHandlerReturn<T> {
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    variant: "info",
    isVisible: false,
  });

  const mergedMessages: FormErrorHandlerMessages = {
    validationBanner: messages?.validationBanner ?? "Please fix the errors below and try again.",
    genericError: messages?.genericError ?? "An error occurred. Please try again.",
    unexpectedError: messages?.unexpectedError ?? "An unexpected error occurred. Please try again.",
  };

  /**
   * Clear the alert banner
   */
  const clearAlert = useCallback(() => {
    setAlert({
      message: "",
      variant: "info",
      isVisible: false,
    });
  }, []);

  /**
   * Handle API errors - maps validation errors to fields or shows general error
   */
  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError) {
        // Check if there are validation errors
        if (
          error.validationErrors &&
          typeof error.validationErrors === "object" &&
          !Array.isArray(error.validationErrors) &&
          Object.keys(error.validationErrors).length > 0
        ) {
          // Map validation errors to form fields
          Object.entries(error.validationErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              setError(field as Path<T>, {
                type: "server",
                message: messages[0], // Take the first error message
              });
            }
          });

          // Show a general validation error banner if there are field errors
          setAlert({
            message: error.message || mergedMessages.validationBanner,
            variant: "error",
            isVisible: true,
          });
        } else {
          // No validation errors - show general error message
          setAlert({
            message: error.message || mergedMessages.genericError,
            variant: "error",
            isVisible: true,
          });
        }
      } else if (error instanceof Error) {
        // Generic JavaScript error
        setAlert({
          message: error.message || mergedMessages.unexpectedError,
          variant: "error",
          isVisible: true,
        });
      } else {
        // Unknown error type
        setAlert({
          message: mergedMessages.unexpectedError,
          variant: "error",
          isVisible: true,
        });
      }
    },
    [mergedMessages.genericError, mergedMessages.unexpectedError, mergedMessages.validationBanner, setError]
  );

  /**
   * Handle success - shows success message
   */
  const handleSuccess = useCallback((message: string) => {
    setAlert({
      message,
      variant: "success",
      isVisible: true,
    });
  }, []);

  return {
    alert,
    handleError,
    handleSuccess,
    clearAlert,
  };
}

