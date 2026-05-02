"use client";

import { useState, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import * as React from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

const hasReactTypeof = (value: unknown): value is { $$typeof: unknown } => {
  return typeof value === "object" && value !== null && "$$typeof" in value;
};

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "datetime-local"
  | "time"
  | "search"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio";

type ErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>> | undefined;

interface SelectOption {
  value: string | number;
  label: string | ReactNode;
  disabled?: boolean;
}

interface BaseInputProps {
  label?: ReactNode;
  error?: ErrorType;
  helperText?: string;
  leftIcon?: LucideIcon | ReactNode;
  rightIcon?: LucideIcon | ReactNode;
  onRightIconClick?: () => void;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  showPasswordToggle?: boolean;
  floatingLabel?: boolean;
}

interface TextInputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: Exclude<InputType, "textarea" | "select">;
  options?: never;
}

interface TextareaProps extends BaseInputProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  type: "textarea";
  rows?: number;
  options?: never;
}

interface SelectProps extends BaseInputProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, "type"> {
  type: "select";
  options: SelectOption[];
  placeholder?: string;
}

type FormInputProps = TextInputProps | TextareaProps | SelectProps;

// ============================================
// Helper Components
// ============================================

const ErrorMessage = ({ error, className }: { error?: ErrorType; className?: string }) => {
  if (!error?.message) return null;

  return (
    <p className={`mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1 ${className || ""}`}>
      <AlertCircle className="w-4 h-4" />
      {error.message as string}
    </p>
  );
};

const HelperText = ({ text }: { text?: string }) => {
  if (!text) return null;

  return (
    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
      {text}
    </p>
  );
};

// ============================================
// Main Component
// ============================================

export const FormInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormInputProps
>((props, ref) => {
  const {
    type = "text",
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onRightIconClick,
    containerClassName = "",
    labelClassName = "",
    inputClassName = "",
    errorClassName = "",
    showPasswordToggle = false,
    floatingLabel = false,
    disabled,
    ...rest
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // Hooks for select dropdown - always called to maintain hook order
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(
    type === "select" ? (rest as SelectProps).value as string | number | undefined : undefined
  );

  const isPassword = type === "password";
  const actualType = isPassword && showPassword ? "text" : type;
  const hasError = !!error?.message;

  // Update selectedValue when value prop changes (only for select type)
  const selectValue = type === "select" ? (rest as SelectProps).value as string | number | undefined : undefined;
  React.useEffect(() => {
    if (type === "select") {
      setSelectedValue(selectValue);
    }
  }, [type, selectValue]);

  // Base classes for all inputs using shadcn styling
  const baseInputClasses = cn(
    hasError 
      ? "border-red-500 dark:border-red-400 focus-visible:ring-red-500/30" 
      : "border-slate-200 dark:border-slate-700 focus-visible:ring-blue-600"
  );

  const inputPadding = cn(
    leftIcon ? "pl-10" : "",
    (rightIcon || (isPassword && showPasswordToggle)) ? "pr-10" : ""
  );

  const renderLabel = () => {
    if (!label) return null;

    if (floatingLabel) {
      return (
        <label
          className={`
            absolute left-3 bg-white dark:bg-slate-900 px-1.5 z-10
            transition-all duration-200 pointer-events-none
            ${isFocused || (rest as TextInputProps).value 
              ? "-top-2.5 text-xs font-medium text-blue-600 dark:text-blue-400" 
              : "top-3 text-sm text-slate-400"
            }
            ${labelClassName}
          `}
        >
          {label}
        </label>
      );
    }

    return (
      <label
        className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${labelClassName}`}
        htmlFor={rest.id || rest.name}
      >
        {label}
        {rest.required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  };

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    // Handle Lucide icon component
    if (typeof leftIcon === 'function' || hasReactTypeof(leftIcon)) {
      const IconComponent = leftIcon as LucideIcon;
      return (
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
          <IconComponent className="w-5 h-5" />
        </span>
      );
    }

    // Handle ReactNode (for custom icons)
    return (
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
        {leftIcon as ReactNode}
      </span>
    );
  };

  const renderRightIcon = () => {
    // Password toggle takes priority
    if (isPassword && showPasswordToggle) {
      return (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      );
    }

    if (!rightIcon) return null;

    const IconWrapper = onRightIconClick ? "button" : "span";

    // Handle Lucide icon component
    if (typeof rightIcon === 'function' || hasReactTypeof(rightIcon)) {
      const IconComponent = rightIcon as LucideIcon;
      return (
        <IconWrapper
          type={onRightIconClick ? "button" : undefined}
          onClick={onRightIconClick}
          className={`
            absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500
            ${onRightIconClick ? "hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors" : "pointer-events-none"}
          `}
          tabIndex={onRightIconClick ? -1 : undefined}
        >
          <IconComponent className="w-5 h-5" />
        </IconWrapper>
      );
    }

    // Handle ReactNode (for custom icons)
    return (
      <IconWrapper
        type={onRightIconClick ? "button" : undefined}
        onClick={onRightIconClick}
        className={`
          absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500
          ${onRightIconClick ? "hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors" : "pointer-events-none"}
        `}
        tabIndex={onRightIconClick ? -1 : undefined}
      >
        {rightIcon as ReactNode}
      </IconWrapper>
    );
  };

  // ============================================
  // Render based on type
  // ============================================

  // Checkbox
  if (type === "checkbox") {
    return (
      <div className={`flex items-start gap-3 ${containerClassName}`}>
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type="checkbox"
          disabled={disabled}
          className={`
            mt-0.5 h-5 w-5 rounded border-slate-300 dark:border-slate-600
            text-blue-600 focus:ring-blue-600 focus:ring-2 focus:ring-offset-0
            bg-slate-50 dark:bg-slate-900 cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError ? "border-red-500" : ""}
            ${inputClassName}
          `}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
        <div className="flex-1">
          {label && (
            <label
              htmlFor={rest.id || rest.name}
              className={`text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer ${labelClassName}`}
            >
              {label}
              {rest.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <HelperText text={helperText} />
          <ErrorMessage error={error} className={errorClassName} />
        </div>
      </div>
    );
  }

  // Radio
  if (type === "radio") {
    return (
      <div className={`flex items-start gap-3 ${containerClassName}`}>
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type="radio"
          disabled={disabled}
          className={`
            mt-0.5 h-5 w-5 border-slate-300 dark:border-slate-600
            text-blue-600 focus:ring-blue-600 focus:ring-2 focus:ring-offset-0
            bg-slate-50 dark:bg-slate-900 cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError ? "border-red-500" : ""}
            ${inputClassName}
          `}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
        <div className="flex-1">
          {label && (
            <label
              htmlFor={rest.id || rest.name}
              className={`text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer ${labelClassName}`}
            >
              {label}
            </label>
          )}
          <ErrorMessage error={error} className={errorClassName} />
        </div>
      </div>
    );
  }

  // Textarea
  if (type === "textarea") {
    const { rows = 4, ...textareaRest } = rest as TextareaHTMLAttributes<HTMLTextAreaElement>;

    return (
      <div className={containerClassName}>
        {!floatingLabel && renderLabel()}
        <div className={cn("relative", floatingLabel && "floating-label-group")}>
          {floatingLabel && renderLabel()}
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              textareaRest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              textareaRest.onBlur?.(e);
            }}
            className={cn(
              baseInputClasses,
              "resize-y min-h-[100px]",
              inputClassName
            )}
            {...textareaRest}
          />
        </div>
        <HelperText text={helperText} />
        <ErrorMessage error={error} className={errorClassName} />
      </div>
    );
  }

  // Select
  if (type === "select") {
    const { options, placeholder, onChange, name, ...selectRest } = rest as SelectProps;

    const selectedOption = options?.find(opt => opt.value === selectedValue);
    const displayText = selectedOption?.label || placeholder || "";

    const handleSelect = (optionValue: string | number) => {
      setSelectedValue(optionValue);
      setOpen(false);
      
      // Create a synthetic event for form compatibility
      if (onChange) {
        const syntheticEvent = {
          target: {
            name: name || "",
            value: String(optionValue),
          },
          currentTarget: {
            name: name || "",
            value: String(optionValue),
          },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }

      // Trigger onBlur if needed
      if (selectRest.onBlur) {
        const blurEvent = {
          target: {
            name: name || "",
            value: String(optionValue),
          },
          currentTarget: {
            name: name || "",
            value: String(optionValue),
          },
        } as React.FocusEvent<HTMLSelectElement>;
        selectRest.onBlur(blurEvent);
      }
    };

    return (
      <div className={containerClassName}>
        {!floatingLabel && renderLabel()}
        <div className={cn("relative", floatingLabel && "floating-label-group")}>
          {floatingLabel && renderLabel()}
          {renderLeftIcon()}
          {/* Hidden input for form compatibility */}
          <input
            type="hidden"
            name={name}
            value={selectedValue || ""}
            ref={ref as React.Ref<HTMLInputElement>}
          />
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
              disabled={disabled}
              onFocus={(e) => {
                setIsFocused(true);
                selectRest.onFocus?.(e as unknown as React.FocusEvent<HTMLSelectElement>);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                selectRest.onBlur?.(e as unknown as React.FocusEvent<HTMLSelectElement>);
              }}
              className={cn(
                "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
                baseInputClasses,
                leftIcon && "pl-10",
                !selectedValue && placeholder && "text-slate-400 dark:text-slate-500",
                inputClassName
              )}
            >
              <span className="truncate">{displayText}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto">
              {placeholder && (
                <DropdownMenuItem
                  disabled
                  className="text-slate-400 dark:text-slate-500"
                >
                  {placeholder}
                </DropdownMenuItem>
              )}
              {options?.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  className={cn(
                    selectedValue === option.value && "bg-accent"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <HelperText text={helperText} />
        <ErrorMessage error={error} className={errorClassName} />
      </div>
    );
  }

  // Default: All other input types (text, email, password, number, tel, url, date, etc.)
  return (
    <div className={containerClassName}>
      {!floatingLabel && renderLabel()}
      <div className={cn("relative", floatingLabel && "floating-label-group")}>
        {floatingLabel && renderLabel()}
        {renderLeftIcon()}
        <Input
          ref={ref as React.Ref<HTMLInputElement>}
          type={actualType as string}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            (rest as TextInputProps).onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            (rest as TextInputProps).onBlur?.(e);
          }}
          className={cn(
            baseInputClasses,
            inputPadding,
            inputClassName
          )}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
        {renderRightIcon()}
      </div>
      <HelperText text={helperText} />
      <ErrorMessage error={error} className={errorClassName} />
    </div>
  );
});

FormInput.displayName = "FormInput";

export default FormInput;

