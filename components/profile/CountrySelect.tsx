'use client';

import { forwardRef, useMemo } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Select } from '@/components/ui/select';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormInput } from '../ui';

interface CountryOption {
  value: string;
  label: string;
  countryCode: string;
}

interface CountrySelectProps {
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>> | undefined;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

// Common phone country codes
const getPhoneCountries = (t: ReturnType<typeof useTranslations>): CountryOption[] => [
  { value: 'EG', label: t('register.phoneCountries.EG'), countryCode: 'EG' },
  { value: 'US', label: t('register.phoneCountries.US'), countryCode: 'US' },
  { value: 'GB', label: t('register.phoneCountries.GB'), countryCode: 'GB' },
  { value: 'SA', label: t('register.phoneCountries.SA'), countryCode: 'SA' },
  { value: 'AE', label: t('register.phoneCountries.AE'), countryCode: 'AE' },
  { value: 'KW', label: t('register.phoneCountries.KW'), countryCode: 'KW' },
  { value: 'QA', label: t('register.phoneCountries.QA'), countryCode: 'QA' },
  { value: 'JO', label: t('register.phoneCountries.JO'), countryCode: 'JO' },
  { value: 'LB', label: t('register.phoneCountries.LB'), countryCode: 'LB' },
];

export const CountrySelect = forwardRef<HTMLSelectElement, CountrySelectProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      id,
      name,
      value,
      onChange,
      onBlur,
      disabled,
      required,
      placeholder,
    },
    ref
  ) => {
    const t = useTranslations('Auth');
    
    // Memoize country options
    const countryOptions = useMemo(() => getPhoneCountries(t), [t]);

    // Convert to FormInput options format
    const options = useMemo(
      () =>
        countryOptions.map((country) => ({
          value: country.value,
          label: country.label,
        })),
      [countryOptions]
    );

    // Find selected country for display
    const selectedCountry = useMemo(
      () => countryOptions.find((c) => c.value === value),
      [countryOptions, value]
    );

    console.log(selectedCountry, "SELECTED COUNTRY");

    return (
      <div className={containerClassName}>
        <FormInput
          ref={ref}
          type="select"
          label={label}
          error={error}
          helperText={helperText}
          containerClassName=""
          labelClassName={labelClassName}
          inputClassName={inputClassName}
          errorClassName={errorClassName}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          options={options}
        />
        {/* Custom select with flags - we'll need to override the select rendering */}
        {selectedCountry && (
          <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
            <ReactCountryFlag
              countryCode={selectedCountry.countryCode}
              svg
              style={{
                width: '1.25rem',
                height: '1.25rem',
              }}
              title={selectedCountry.countryCode}
            />
          </div>
        )}
      </div>
    );
  }
);

CountrySelect.displayName = 'CountrySelect';

// Enhanced version that actually renders flags in the select using shadcn Select
export const CountrySelectWithFlags = forwardRef<HTMLSelectElement, CountrySelectProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      id,
      name,
      value,
      onChange,
      onBlur,
      disabled,
      required,
      placeholder,
    },
    ref
  ) => {
    const t = useTranslations('Auth');
    
    // Memoize country options
    const countryOptions = useMemo(() => getPhoneCountries(t), [t]);
    const hasError = !!error?.message;

    return (
      <div className={containerClassName}>
        {label && (
          <label
            className={cn(
              "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2",
              labelClassName
            )}
            htmlFor={id || name}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {/* Flag display for selected value */}
          {value && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <ReactCountryFlag
                countryCode={countryOptions.find((c) => c.value === value)?.countryCode || ''}
                svg
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                }}
                title={countryOptions.find((c) => c.value === value)?.countryCode}
              />
            </div>
          )}
          <Select
            ref={ref}
            id={id}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className={cn(
              "pl-12",
              hasError && "border-red-500 dark:border-red-400 focus:ring-red-500/30",
              inputClassName
            )}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {countryOptions.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </Select>
        </div>
        {helperText && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
        {error?.message && (
          <p className={cn(
            "mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1",
            errorClassName
          )}>
            <AlertCircle className="w-4 h-4" />
            {error.message as string}
          </p>
        )}
      </div>
    );
  }
);

CountrySelectWithFlags.displayName = 'CountrySelectWithFlags';

