'use client';

import { useState } from 'react';
import { FormInput, useToast } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { MapPin, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSettingsContext } from '@/contexts/SettingsContext';

interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactSection({ className = '' }: { className?: string }) {
  const t = useTranslations('ContactSection');
  const { officeLocation, emails } = useSettingsContext();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement contact form submission API call
      console.log('Contact form submitted:', data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      reset();
      showToast(t('toast.success'), 'success');
    } catch (error) {
      showToast(t('toast.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-gray-50 dark:bg-[#2d3238] p-8 md:p-12 rounded-3xl ${className}`}>
      {/* Contact Information */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-4 text-[#0f141a] dark:text-white">
          {t('title')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {t('subtitle')}
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-[#0f141a] dark:text-white">{t('info.headquarters.title')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {officeLocation || t('info.headquarters.address')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-[#0f141a] dark:text-white">{t('info.emailSupport.title')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {emails.length > 0 ? emails[0] : 'priority@apitech.example.com'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label={t('form.fullName.label')}
            placeholder={t('form.fullName.placeholder')}
            error={errors.fullName}
            {...register('fullName', { required: t('form.fullName.required') })}
          />
          
          <FormInput
            type="email"
            label={t('form.email.label')}
            placeholder={t('form.email.placeholder')}
            error={errors.email}
            {...register('email', {
              required: t('form.email.required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('form.email.invalid'),
              },
            })}
          />
        </div>
        
        <FormInput
          label={t('form.subject.label')}
          placeholder={t('form.subject.placeholder')}
          error={errors.subject}
          {...register('subject', { required: t('form.subject.required') })}
        />
        
        <FormInput
          type="textarea"
          label={t('form.message.label')}
          placeholder={t('form.message.placeholder')}
          rows={4}
          error={errors.message}
          {...register('message', { required: t('form.message.required') })}
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('form.sending') : t('form.sendMessage')}
        </button>
      </form>
    </section>
  );
}

export default ContactSection;
