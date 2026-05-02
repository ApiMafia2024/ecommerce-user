"use client";

import { Loader2, User, Phone, AtSign, Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import { FormInput, Alert } from "@/components/ui";
import { FileUpload } from "@/components/contact/FileUpload";
import { LocationsSection } from "./LocationsSection";
import { ProfileUpdateFormData } from "@/validations/auth.validations";
import { AlertState } from "@/hooks/useFormErrorHandler";
import { usePhoneCountries } from "@/hooks/usePhoneCountries";
import { useProfile } from "@/hooks/queries/useProfile";

interface ProfileFormProps {
  form: UseFormReturn<ProfileUpdateFormData>;
  fields: UseFieldArrayReturn<ProfileUpdateFormData, "locations", "id">["fields"];
  append: UseFieldArrayReturn<ProfileUpdateFormData, "locations", "id">["append"];
  remove: UseFieldArrayReturn<ProfileUpdateFormData, "locations", "id">["remove"];
  alert: AlertState;
  previewImageUrl: string;
  isUpdating: boolean;
  imageFile: File | null | undefined;
  userEmail?: string;
  handleFilesChange: (files: File[]) => void;
  handleImageRemove: () => void;
  onSubmit: (data: ProfileUpdateFormData) => void;
  clearAlert: () => void;
}

export function ProfileForm({
  form,
  fields,
  append,
  remove,
  alert,
  previewImageUrl,
  isUpdating,
  imageFile,
  userEmail,
  handleFilesChange,
  handleImageRemove,
  onSubmit,
  clearAlert,
}: ProfileFormProps) {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const { register, handleSubmit, watch, reset, formState: { errors } } = form;
  const phoneCountries = usePhoneCountries();
  const { data: profile } = useProfile();
  const lastUpdated = profile?.data?.last_update;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("profile.title")}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t("profile.subtitle")}</p>
      </div>

      <div className="p-6 sm:p-8">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Photo */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-slate-100 dark:ring-slate-800/50">
                  <img
                    alt={t("profile.alt.currentProfile")}
                    className="w-full h-full object-cover"
                    src={previewImageUrl}
                  />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {t("profile.photo.title")}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {t("profile.photo.help")}
                </p>
                {imageFile && (
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {t("profile.photo.remove")}
                  </button>
                )}
              </div>
            </div>
            <FileUpload
              maxSize={2}
              onFilesChange={handleFilesChange}
              className="max-w-full"
            />
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label={t("profile.form.firstName")}
              id="first_name"
              placeholder={t("profile.form.firstNamePlaceholder")}
              leftIcon={User}
              error={errors.first_name}
              {...register("first_name")}
            />
            <FormInput
              label={t("profile.form.lastName")}
              id="last_name"
              placeholder={t("profile.form.lastNamePlaceholder")}
              leftIcon={User}
              error={errors.last_name}
              {...register("last_name")}
            />
            <FormInput
              type="select"
              label={t("profile.form.country")}
              id="phone_country"
              placeholder={t("profile.form.phonePlaceholder")}
              leftIcon={Phone}
              options={phoneCountries}
              error={errors.phone_country}
              {...register("phone_country")}
            />
            <FormInput
              type="tel"
              label={t("profile.form.phoneNumber")}
              id="phone"
              placeholder={t("profile.form.phonePlaceholder")}
              leftIcon={Phone}
              error={errors.phone}
              {...register("phone")}
            />
            <FormInput
              type="email"
              label={t("profile.form.emailReadOnly")}
              id="email_display"
              readOnly
              disabled
              leftIcon={AtSign}
              defaultValue={userEmail || ""}
              containerClassName="md:col-span-2"
            />
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Locations Section */}
          <LocationsSection
            fields={fields}
            append={append}
            remove={remove}
            watch={watch}
            register={register}
            errors={errors}
          />

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <Info className="align-middle w-4 h-4 mr-1 inline-block" />
              {t("profile.lastUpdated")} {lastUpdated}
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-lg"
                type="button"
                onClick={() => reset()}
                disabled={isUpdating}
              >
                {t("profile.actions.cancel")}
              </button>
              <button
                className="flex-1 sm:flex-none px-8 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-600/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("profile.actions.saving")}
                  </>
                ) : (
                  t("profile.actions.saveChanges")
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

