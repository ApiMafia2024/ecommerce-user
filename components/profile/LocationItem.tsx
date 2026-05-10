"use client";

import { MapPin, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormRegister, FieldErrors, UseFormWatch, FieldArrayWithId } from "react-hook-form";
import { FormInput } from "@/components/ui";
import { ProfileUpdateFormData, LocationFormData } from "@/validations/auth.validations";
import { usePhoneCountries } from "@/hooks/usePhoneCountries";

interface LocationItemProps {
  index: number;
  field: FieldArrayWithId<ProfileUpdateFormData, "locations", "id">;
  register: UseFormRegister<ProfileUpdateFormData>;
  errors: FieldErrors<ProfileUpdateFormData>;
  watch: UseFormWatch<ProfileUpdateFormData>;
  onRemove: () => void;
}

export function LocationItem({ index, field, register, errors, watch, onRemove }: LocationItemProps) {
  const t = useTranslations("Auth");
  const phoneCountries = usePhoneCountries();
  const locationId = watch(`locations.${index}.id` as const);

  return (
    <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/30 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
          {t("profile.form.location")} {index + 1}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {t("profile.form.remove")}
        </button>
      </div>

      {locationId && (
        <input
          type="hidden"
          {...register(`locations.${index}.id` as const)}
          value={locationId}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          type="select"
          label={t("profile.form.country2")}
          id={`locations.${index}.country`}
          placeholder={t("profile.form.country2")}
          options={phoneCountries}
          error={errors.locations?.[index]?.country}
          {...register(`locations.${index}.country` as const)}
          value={watch(`locations.${index}.country` as const)}
        />
        <FormInput
          label={t("profile.form.city")}
          id={`locations.${index}.city`}
          placeholder={t("profile.form.cityPlaceholder")}
          leftIcon={MapPin}
          error={errors.locations?.[index]?.city}
          {...register(`locations.${index}.city` as const)}
        />
        <FormInput
          label={t("profile.form.state")}
          id={`locations.${index}.state`}
          placeholder={t("profile.form.statePlaceholder")}
          leftIcon={MapPin}
          error={errors.locations?.[index]?.state}
          {...register(`locations.${index}.state` as const)}
        />
        <FormInput
          label={t("profile.form.street")}
          id={`locations.${index}.street`}
          placeholder={t("profile.form.streetPlaceholder")}
          leftIcon={MapPin}
          error={errors.locations?.[index]?.street}
          {...register(`locations.${index}.street` as const)}
        />
        <FormInput
          type="url"
          label={t("profile.form.googleMapUrl")}
          id={`locations.${index}.google_map_url`}
          placeholder={t("profile.form.googleMapUrlPlaceholder")}
          leftIcon={MapPin}
          error={errors.locations?.[index]?.google_map_url}
          containerClassName="md:col-span-2"
          {...register(`locations.${index}.google_map_url` as const)}
        />
      </div>
    </div>
  );
}

