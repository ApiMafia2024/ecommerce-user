'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  CheckCircle2,
  Circle,
  Info,
  LockKeyhole,
  Unlock,
  Loader2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { FormInput, Alert } from '@/components/ui'
import { createChangePasswordSchema, ChangePasswordFormData } from '@/validations/auth.validations'
import { useChangePasswordMutation } from '@/hooks/mutations/useAuthMutations'
import { useFormErrorHandler } from '@/hooks/useFormErrorHandler'

export function ChangePasswordTab() {
  const t = useTranslations('Auth')
  const v = useTranslations('Validation')
  const c = useTranslations('Common')

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(createChangePasswordSchema(v)) as any,
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  })

  const { alert, handleError, handleSuccess, clearAlert } = useFormErrorHandler<ChangePasswordFormData>(setError, {
    validationBanner: c('formErrors.validationBanner'),
    genericError: c('formErrors.genericError'),
    unexpectedError: c('formErrors.unexpectedError'),
  })

  const newPassword = watch('new_password')

  const { mutate: changePassword, isPending: isChangingPassword } = useChangePasswordMutation({
    onSuccess: () => {
      handleSuccess(t('changePassword.success'))
      // Reset form on success
      reset()
    },
    onError: (error) => {
      handleError(error)
    },
  })

  const getPasswordStrength = () => {
    if (!newPassword) return 0
    let strength = 0
    if (newPassword.length >= 12) strength++
    if (/[A-Z]/.test(newPassword)) strength++
    if (/[^A-Za-z0-9]/.test(newPassword)) strength++
    if (/[0-9]/.test(newPassword)) strength++
    return strength
  }

  const strengthLabels = [
    t('changePassword.strength.weak'),
    t('changePassword.strength.fair'),
    t('changePassword.strength.good'),
    t('changePassword.strength.strong'),
  ]
  const strengthColors = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500']
  const strength = getPasswordStrength()

  const onSubmit = (data: ChangePasswordFormData) => {
    clearAlert()
    changePassword(data)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-center items-center">
          {/* Form Column */}
          <div className="md:w-2/3">
            {alert.isVisible && (
              <div className="mb-6">
                <Alert
                  variant={alert.variant}
                  message={alert.message}
                  onClose={clearAlert}
                  autoDismiss={alert.variant === 'success'}
                  dismissAfter={3000}
                />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Current Password */}
              <FormInput
                type="password"
                label={t('changePassword.form.currentPasswordLabel')}
                id="current_password"
                placeholder={t('changePassword.form.currentPasswordPlaceholder')}
                leftIcon={LockKeyhole}
                error={errors.current_password}
                showPasswordToggle
                {...register('current_password')}
              />

              <hr className="border-slate-100 dark:border-slate-700" />

              {/* New Password */}
              <div className="space-y-2">
                <FormInput
                  type="password"
                  label={t('changePassword.form.newPasswordLabel')}
                  id="new_password"
                  placeholder={t('changePassword.form.newPasswordPlaceholder')}
                  leftIcon={LockKeyhole}
                  error={errors.new_password}
                  showPasswordToggle
                  {...register('new_password')}
                />

                {/* Strength Meter */}
                {newPassword && (
                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5">
                      <span>{t('changePassword.passwordStrength')}</span>
                      <span
                        className={
                          strength === 4 ? 'text-green-500' : strength >= 2 ? 'text-amber-500' : 'text-red-500'
                        }
                      >
                        {strength > 0 ? strengthLabels[strength - 1] || strengthLabels[0] : '—'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full flex overflow-hidden">
                      <div
                        className={`h-full ${strength > 0 ? strengthColors[strength - 1] : 'bg-slate-200'} rounded-full transition-all`}
                        style={{ width: `${(strength / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Requirements List */}
                {newPassword && (
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <li
                      className={`flex items-center gap-2 text-xs ${newPassword.length >= 12 ? 'text-green-500' : 'text-slate-500'
                        }`}
                    >
                      {newPassword.length >= 8 ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      {t('changePassword.requirements.minChars')}
                    </li>
                    <li
                      className={`flex items-center gap-2 text-xs ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-slate-500'
                        }`}
                    >
                      {/[A-Z]/.test(newPassword) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      {t('changePassword.requirements.oneUppercase')}
                    </li>
                    <li
                      className={`flex items-center gap-2 text-xs ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-500' : 'text-slate-500'
                        }`}
                    >
                      {/[^A-Za-z0-9]/.test(newPassword) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      {t('changePassword.requirements.oneSpecial')}
                    </li>
                    <li
                      className={`flex items-center gap-2 text-xs ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-slate-500'
                        }`}
                    >
                      {/[0-9]/.test(newPassword) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      {t('changePassword.requirements.oneNumber')}
                    </li>
                  </ul>
                )}
              </div>

              {/* Confirm Password */}
              <FormInput
                type="password"
                label={t('changePassword.form.confirmNewPasswordLabel')}
                id="new_password_confirmation"
                placeholder={t('changePassword.form.confirmNewPasswordPlaceholder')}
                leftIcon={LockKeyhole}
                error={errors.new_password_confirmation}
                showPasswordToggle
                {...register('new_password_confirmation')}
              />

              {/* Action Footer */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 self-center text-white font-bold rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t('changePassword.changing')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('changePassword.changePassword')}</span>
                      <Unlock className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
