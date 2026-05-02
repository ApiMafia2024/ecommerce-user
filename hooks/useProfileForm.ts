import { useMemo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/queries/useProfile";
import { useUpdateProfileMutation } from "@/hooks/mutations/useAuthMutations";
import { createProfileUpdateSchema, ProfileUpdateFormData, LocationFormData } from "@/validations/auth.validations";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
import { ProfileUser } from "@/types/api.types";

function mapLocationsToFormData(locations: ProfileUser["locations"] | undefined): LocationFormData[] {
  if (!locations?.length) return [];
  return locations.map((loc) => ({
    country: loc.country ?? "",
    city: loc.city ?? "",
    state: loc.state ?? "",
    street: loc.street ?? "",
    google_map_url: loc.google_map_url ?? "",
  }));
}

export function useProfileForm() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  const v = useTranslations("Validation");
  const c = useTranslations("Common");
  const t = useTranslations("Auth");

  // Parse user name into first_name and last_name
  const parseUserName = useCallback((name?: string) => {
    if (!name) return { first_name: "", last_name: "" };
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return { first_name: parts[0], last_name: "" };
    return {
      first_name: parts[0],
      last_name: parts.slice(1).join(" "),
    };
  }, []);

  const profileLocations = useMemo(
    () => mapLocationsToFormData((profile?.data as ProfileUser)?.locations),
    [profile?.data]
  );

  // Memoize default values (include locations from profile so they render initially)
  const defaultValues = useMemo<ProfileUpdateFormData>(() => {
    const { first_name, last_name } = parseUserName(user?.name);
    return {
      first_name,
      last_name,
      phone: user?.phone || "",
      phone_country: "EG",
      image: null,
      locations: profileLocations,
    };
  }, [user, parseUserName, profileLocations]);

  // Form setup
  const form = useForm<ProfileUpdateFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(createProfileUpdateSchema(v)) as any,
    defaultValues,
  });

  const { setValue, setError, watch, reset } = form;

  // Error handler
  const { alert, handleError, handleSuccess, clearAlert } = useFormErrorHandler<ProfileUpdateFormData>(setError, {
    validationBanner: c("formErrors.validationBanner"),
    genericError: c("formErrors.genericError"),
    unexpectedError: c("formErrors.unexpectedError"),
  });

  // Watch image file
  const imageFile = watch("image");

  // Update profile mutation
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfileMutation({
    onSuccess: (response) => {
      handleSuccess(t("profile.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      const { first_name, last_name } = parseUserName(response.data.name);
      const locations = mapLocationsToFormData((response.data as ProfileUser)?.locations);
      reset({
        first_name,
        last_name,
        phone: response.data.phone || "",
        phone_country: "EG",
        image: null,
        locations,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Handle file upload
  const handleFilesChange = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        setValue("image", files[0], { shouldValidate: true });
      } else {
        setValue("image", null, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // Handle image removal
  const handleImageRemove = useCallback(() => {
    setValue("image", null, { shouldValidate: true });
  }, [setValue]);

  // Form submission
  const onSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => {
      clearAlert();
      updateProfile(data as ProfileUpdateFormData);
    },
    [clearAlert, updateProfile]
  );

  // Reset form when user or profile data changes (so locations render initially)
  useEffect(() => {
    if (user) {
      const { first_name, last_name } = parseUserName(user.name);
      reset({
        first_name,
        last_name,
        phone: user.phone || "",
        phone_country: "EG",
        image: null,
        locations: profileLocations,
      });
    }
  }, [user, reset, parseUserName, profileLocations]);

  // Preview image URL
  const previewImageUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    return user?.image?.original || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face";
  }, [imageFile, user?.image?.original]);

  return {
    form,
    alert,
    previewImageUrl,
    imageFile,
    isUpdating,
    handleFilesChange,
    handleImageRemove,
    onSubmit,
    clearAlert,
  };
}

