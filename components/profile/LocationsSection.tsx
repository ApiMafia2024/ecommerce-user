"use client";

import { MapPin, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormRegister, FieldErrors, UseFormWatch, UseFieldArrayReturn } from "react-hook-form";
import { ProfileUpdateFormData } from "@/validations/auth.validations";
import { LocationItem } from "./LocationItem";

interface LocationsSectionProps {
  fields: UseFieldArrayReturn<ProfileUpdateFormData, "locations", "id">["fields"];
  append: UseFieldArrayReturn<ProfileUpdateFormData, "locations", "id">["append"];
  remove: UseFieldArrayReturn<ProfileUpdateFormData, "locations", "id">["remove"];
  watch: UseFormWatch<ProfileUpdateFormData>;
  register: UseFormRegister<ProfileUpdateFormData>;
  errors: FieldErrors<ProfileUpdateFormData>;
}

export function LocationsSection({
  fields,
  append,
  remove,
  watch,
  register,
  errors,
}: LocationsSectionProps) {
  const t = useTranslations("Auth");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t("profile.form.locations")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("profile.form.locationsHelp")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => append({ country: "", city: "", state: "", street: "", google_map_url: "" })}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("profile.form.addLocation")}
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
          <MapPin className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("profile.form.noLocations")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <LocationItem
              key={field.id}
              index={index}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

