import * as yup from 'yup';


type TranslationValues = Record<string, string | number | Date>;
type TFunction = (key: string, values?: TranslationValues) => string;

export type LoginFormData = {
  email_or_phone: string;
  password: string;
};

const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

export const createLoginSchema = (t: TFunction) =>
  yup.object().shape({
    email_or_phone: yup
      .string()
      .required(t('emailOrPhoneRequired'))
      .test('email-or-phone', t('emailOrPhoneInvalid'), (value) => {
        if (!value) return false;
        const v = value.trim();
        return emailRegex.test(v) || phoneRegex.test(v);
      }),
    password: yup
      .string()
      .min(8, t('passwordMin', { min: 8 }))
      .required(t('passwordRequired')),
  });

export type RegisterFormData = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_and_conditions: boolean;
  phone_country: string;
};

// Registration schema
export const createRegisterSchema = (t: TFunction) =>
  yup.object().shape({
    first_name: yup.string().required(t('firstNameRequired')),
    last_name: yup.string().required(t('lastNameRequired')),
    phone: yup.string().required(t('phoneRequired')),
    email: yup.string().email(t('invalidEmail')).required(t('emailRequired')),
    password: yup
      .string()
      .min(8, t('passwordMin', { min: 8 }))
      .matches(/[A-Z]/, t('passwordUppercase'))
      .matches(/[a-z]/, t('passwordLowercase'))
      .matches(/[0-9]/, t('passwordNumber'))
      .matches(/[^A-Za-z0-9]/, t('passwordSpecial'))
      .required(t('passwordRequired')),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref('password')], t('passwordsMustMatch'))
      .required(t('passwordConfirmationRequired')),
    terms_and_conditions: yup
      .boolean()
      .oneOf([true], t('termsMustAccept'))
      .required(t('termsMustAccept')),
    phone_country: yup.string().required(t('phoneCountryRequired')),
  });

// Forgot password schema
export type ForgotPasswordFormData = {
  email: string;
};

export const createForgotPasswordSchema = (t: TFunction) =>
  yup.object().shape({
    email: yup.string().email(t('invalidEmail')).required(t('emailRequired')),
  });

// Reset password schema
export type ResetPasswordFormData = {
  otp: string;
  password: string;
  password_confirmation: string;
};

export const createResetPasswordSchema = (t: TFunction) =>
  yup.object().shape({
    otp: yup.string().required(t('otpRequired')),
    password: yup
      .string()
      .min(8, t('passwordMin', { min: 8 }))
      .matches(/[A-Z]/, t('passwordUppercase'))
      .matches(/[a-z]/, t('passwordLowercase'))
      .matches(/[0-9]/, t('passwordNumber'))
      .matches(/[^A-Za-z0-9]/, t('passwordSpecial'))
      .required(t('passwordRequired')),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref('password')], t('passwordsMustMatch'))
      .required(t('passwordConfirmationRequired')),
  });

// Change password schema
export type ChangePasswordFormData = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

export const createChangePasswordSchema = (t: TFunction) =>
  yup.object().shape({
    current_password: yup.string().required(t('currentPasswordRequired')),
    new_password: yup
      .string()
      .min(8, t('passwordMin', { min: 8 }))
      .matches(/[A-Z]/, t('passwordUppercase'))
      .matches(/[a-z]/, t('passwordLowercase'))
      .matches(/[0-9]/, t('passwordNumber'))
      .matches(/[^A-Za-z0-9]/, t('passwordSpecial'))
      .required(t('passwordRequired')),
    new_password_confirmation: yup
      .string()
      .oneOf([yup.ref('new_password')], t('passwordsMustMatch'))
      .required(t('passwordConfirmationRequired')),
  });

// Profile update schema
export interface LocationFormData {
  id?: number;
  country: string;
  city: string;
  state: string;
  street: string;
  google_map_url: string;
}

export type ProfileUpdateFormData = {
  first_name: string;
  last_name: string;
  phone: string;
  phone_country: string;
  image: File | null | undefined;
  locations?: LocationFormData[];
};

export const createProfileUpdateSchema = (t: TFunction) =>
  yup.object().shape({
    first_name: yup.string().required(t('firstNameRequired')),
    last_name: yup.string().required(t('lastNameRequired')),
    phone: yup.string().required(t('phoneRequired')),
    phone_country: yup.string().required(t('phoneCountryRequired')),
    image: yup
      .mixed<File>()
      .nullable()
      .test('fileSize', t('imageSizeLimit', { maxSize: 2 }), (value) => {
        if (!value) return true; // Optional field
        return value.size <= 2 * 1024 * 1024; // 2MB
      })
      .test('fileType', t('imageTypeInvalid'), (value) => {
        if (!value) return true; // Optional field
        return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(value.type);
      }),
    locations: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.number().optional(),
          country: yup.string().required(t('locationCountryRequired')),
          city: yup.string().required(t('locationCityRequired')),
          state: yup.string().required(t('locationStateRequired')),
          street: yup.string().required(t('locationStreetRequired')),
          google_map_url: yup.string().url(t('invalidUrl')).required(t('locationMapUrlRequired')),
        })
      )
      .optional(),
  });