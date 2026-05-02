'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/ui';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { FileUpload } from '@/components/contact/FileUpload';
import { useFormErrorHandler } from '@/hooks/useFormErrorHandler';
import { Alert } from '@/components/ui';
import { MapPin, Phone, AtSign, Share2, Send, Github, Twitter, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/endpoints';
import { ApiEmptyResponse } from '@/types/api.types';

import { Link } from '@/i18n/navigation';

interface ContactFormData {
  fullName: string;
  businessEmail: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const t = useTranslations('ContactPage');
  const c = useTranslations('Common');
  const { officeLocation, phone, emails, github, twitter, linkedin } = useSettingsContext();
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { alert, handleError, handleSuccess, clearAlert } = useFormErrorHandler<ContactFormData>(setError, {
    validationBanner: c('formErrors.validationBanner'),
    genericError: c('formErrors.genericError'),
    unexpectedError: c('formErrors.unexpectedError'),
  });

  const onSubmit = async (data: ContactFormData) => {
    clearAlert();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', data.fullName);
      formData.append('email', data.businessEmail);
      formData.append('subject', data.subject);
      formData.append('message', data.message);
      uploadedFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      await apiClient.postForm<ApiEmptyResponse>(endpoints.contacts, formData);

      handleSuccess(t('toast.success'));
      reset();
      setUploadedFiles([]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="max-w-[1280px] mx-auto px-4 lg:px-20 py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('breadcrumbs.home'), href: '/' },
            { label: t('breadcrumbs.contact') },
          ]}
          className="mb-8"
        />

        {/* Page Heading */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#0e181b] dark:text-white">
            {t('title')}
          </h1>
          <p className="text-lg text-[#4e8597] dark:text-gray-400 max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Alert Banner */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Company Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold border-l-4 border-primary pl-4 text-[#0e181b] dark:text-white">
                {t('companyInfo.title')}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Office Location */}
                <div className="bg-white dark:bg-[#2d3439] p-6 rounded-xl border border-[#d0e1e7] dark:border-[#3a424a] hover:border-primary/50 transition-colors">
                  <MapPin className="w-6 h-6 text-primary mb-3 block" />
                  <h4 className="font-bold text-base mb-1 text-[#0e181b] dark:text-white">{t('companyInfo.office.title')}</h4>
                  <p className="text-sm text-[#4e8597] dark:text-gray-400">
                    {officeLocation || (
                      <>
                        123 Tech Plaza,<br />
                        San Francisco, CA 94103
                      </>
                    )}
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-white dark:bg-[#2d3439] p-6 rounded-xl border border-[#d0e1e7] dark:border-[#3a424a] hover:border-primary/50 transition-colors">
                  <Phone className="w-6 h-6 text-primary mb-3 block" />
                  <h4 className="font-bold text-base mb-1 text-[#0e181b] dark:text-white">{t('companyInfo.phone.title')}</h4>
                  <p className="text-sm text-[#4e8597] dark:text-gray-400">
                    {phone || '+1 (555) 000-1234'}<br />
                    {t('companyInfo.phone.hours')}
                  </p>
                </div>

                {/* Email */}
                <div className="bg-white dark:bg-[#2d3439] p-6 rounded-xl border border-[#d0e1e7] dark:border-[#3a424a] hover:border-primary/50 transition-colors">
                  <AtSign className="w-6 h-6 text-primary mb-3 block" />
                  <h4 className="font-bold text-base mb-1 text-[#0e181b] dark:text-white">{t('companyInfo.email.title')}</h4>
                  <p className="text-sm text-[#4e8597] dark:text-gray-400">
                    {emails.length > 0 ? (
                      emails.map((email, index) => (
                        <span key={index}>
                          {email}
                          {index < emails.length - 1 && <br />}
                        </span>
                      ))
                    ) : (
                      <>
                        support@apitech.com<br />
                        sales@apitech.com
                      </>
                    )}
                  </p>
                </div>

                {/* Socials */}
                {(github || twitter || linkedin) && (
                  <div className="bg-white dark:bg-[#2d3439] p-6 rounded-xl border border-[#d0e1e7] dark:border-[#3a424a] hover:border-primary/50 transition-colors">
                    <Share2 className="w-6 h-6 text-primary mb-3 block" />
                    <h4 className="font-bold text-base mb-1 text-[#0e181b] dark:text-white">{t('companyInfo.socials.title')}</h4>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {github && (
                        <a 
                          href={github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {linkedin && (
                        <a 
                          href={linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                      {twitter && (
                        <a 
                          href={twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
                        >
                          <Twitter className="w-4 h-4" />
                          X
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Placeholder */}
            {/* <div className="w-full h-64 rounded-xl overflow-hidden grayscale contrast-125 border border-[#d0e1e7] dark:border-[#3a424a] relative group">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxajRAJFBkjKAGTX7GKBTUaDLEcg7iPgkVS1l2HGarbqLhGYirVXS0FHS4Waow-XjLrf06JAt7Oh7XoGPXdlQLEc_-cx4rqWK4wJkWiunNUAfGY11QcuXEpesJS6RZV0sp_JLcEdIB3GmyXLnOYKR6PlD3dD6FH5a_JY6hiKxY9zjqPmXMkZxJDEo2xzWTMgAh-aTTPaVBli4FtvK9rbDcIWHrBAqpGPpvdL3aSPR7u8fxvRlTfQ1qIXeWj-sPfGmFvUXzDuKsEQ"
                alt={t('map.imageAlt')}
              />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-4 left-4 bg-white dark:bg-background-dark p-3 rounded-lg shadow-xl flex items-center gap-2">
                <MapPin className="text-primary w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0e181b] dark:text-white">
                  {t('map.badge')}
                </span>
              </div>
            </div> */}
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#2d3439] rounded-2xl p-6 md:p-8 shadow-xl shadow-black/5 border border-[#d0e1e7] dark:border-[#3a424a]">
              <h3 className="text-2xl font-bold mb-8 text-[#0e181b] dark:text-white">
                {t('form.title')}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name and Business Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label={t('form.fullName.label')}
                    placeholder={t('form.fullName.placeholder')}
                    error={errors.fullName}
                    {...register('fullName', { required: t('form.fullName.required') })}
                  />
                  
                  <FormInput
                    type="email"
                    label={t('form.businessEmail.label')}
                    placeholder={t('form.businessEmail.placeholder')}
                    error={errors.businessEmail}
                    {...register('businessEmail', {
                      required: t('form.businessEmail.required'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('form.businessEmail.invalid'),
                      },
                    })}
                  />
                </div>

                {/* Phone Number and Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    type="tel"
                    label={t('form.phoneNumber.label')}
                    placeholder={t('form.phoneNumber.placeholder')}
                    error={errors.phoneNumber}
                    {...register('phoneNumber', { required: t('form.phoneNumber.required') })}
                  />
                  
                  <FormInput
                    type="select"
                    label={t('form.subject.label')}
                    placeholder={t('form.subject.placeholder')}
                    error={errors.subject}
                    options={[
                      { value: 'Technical Support', label: t('form.subject.options.technicalSupport') },
                      { value: 'Sales Inquiry', label: t('form.subject.options.salesInquiry') },
                      { value: 'API Partnerships', label: t('form.subject.options.apiPartnerships') },
                      { value: 'Billing Question', label: t('form.subject.options.billingQuestion') },
                    ]}
                    {...register('subject', { required: t('form.subject.required') })}
                  />
                </div>

                {/* Message */}
                <FormInput
                  type="textarea"
                  label={t('form.message.label')}
                  placeholder={t('form.message.placeholder')}
                  rows={4}
                  error={errors.message}
                  {...register('message', { required: t('form.message.required') })}
                />

                {/* File Upload */}
                <FileUpload
                  onFilesChange={setUploadedFiles}
                  maxSize={10}
                />

                {/* Submit Button and Privacy Notice */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-[#4e8597] dark:text-gray-400 max-w-xs italic">
                    {t('privacy.prefix')}{' '}
                    <Link href="/terms" className="underline hover:text-primary">
                      {t('privacy.privacyPolicy')}
                    </Link>{' '}
                    {t('privacy.suffix')}
                  </p>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('form.sending') : t('form.sendMessage')}
                    {!isSubmitting && (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
