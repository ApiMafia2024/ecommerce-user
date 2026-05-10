"use client";

import { useFieldArray } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLogoutMutation } from "@/hooks/mutations/useAuthMutations";
import { useProfileTabs } from "@/hooks/useProfileTabs";
import { useProfileForm } from "@/hooks/useProfileForm";
import { usePaymentCallback } from "@/hooks/mutations/usePaymentCallback";
import Navbar from "@/components/shared/Navbar";
import { ChangePasswordTab } from "@/components/profile/ChangePasswordTab";
import { OrdersTab } from "@/components/profile/OrdersTab";
import { WishlistTab } from "@/components/profile/WishlistTab";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ConnectedAccounts } from "@/components/profile/ConnectedAccounts";
import { ProfileFooter } from "@/components/profile/ProfileFooter";
import { PaymentSuccessModal } from "@/components/profile/PaymentSuccessModal";
import { useProfile } from "@/hooks/queries/useProfile";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const { activeTab, getTabHref, sidebarItemClass, tabTriggerClass } = useProfileTabs();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const {
    form,
    alert,
    previewImageUrl,
    imageFile,
    isUpdating,
    handleFilesChange,
    handleImageRemove,
    onSubmit,
    clearAlert,
  } = useProfileForm();

  // Field array for locations
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  });

  const { data: profile } = useProfile();

  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogoutMutation({
    onSuccess: () => logout(),
    onError: () => logout(),
  });

  const handleLogout = (allDevices: boolean) => {
    logoutMutate({ allDevices });
  };

  // Payment callback handling
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const processedTransactionIdRef = useRef<string | null>(null);

  const paymentCallback = usePaymentCallback();

  useEffect(() => {
    const txId = searchParams.get('transaction_id');
    // Only process if we have a transaction_id and haven't processed it yet
    if (txId && processedTransactionIdRef.current !== txId) {
      processedTransactionIdRef.current = txId;

      // Use setTimeout to defer state updates outside the effect body
      setTimeout(() => {
        setShowPaymentModal(true);
        setPaymentError(null);

        // Call the payment callback endpoint
        paymentCallback.mutate(
          { transaction_id: txId },
          {
            onSuccess: () => {
              // Success is handled by the modal state
            },
            onError: (error: unknown) => {
              let errorMessage = 'Payment verification failed';
              if (error instanceof Error) {
                errorMessage = error.message;
              }
              setPaymentError(errorMessage);
            },
          }
        );
      }, 0);
    }
  }, [searchParams, paymentCallback]);

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentError(null);
    processedTransactionIdRef.current = null;

    // Remove transaction_id from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('transaction_id');
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar
            activeTab={activeTab}
            getTabHref={getTabHref}
            sidebarItemClass={sidebarItemClass}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />

          <div className="flex-1">
            <ProfileTabs
              activeTab={activeTab}
              getTabHref={getTabHref}
              tabTriggerClass={tabTriggerClass}
            />

            {activeTab === "profile" ? (
              <>
                <ProfileForm
                  form={form}
                  fields={fields}
                  append={append}
                  remove={remove}
                  alert={alert}
                  previewImageUrl={previewImageUrl}
                  isUpdating={isUpdating}
                  imageFile={imageFile}
                  userEmail={user?.email}
                  handleFilesChange={handleFilesChange}
                  handleImageRemove={handleImageRemove}
                  onSubmit={onSubmit}
                  clearAlert={clearAlert}
                />

                {/* <ConnectedAccounts /> */}
              </>
            ) : activeTab === "change-password" && profile?.data?.socialite_account === false ? (
              <ChangePasswordTab />
            ) : activeTab === "orders" ? (
              <OrdersTab />
            ) : (
              <WishlistTab />
            )}
          </div>
        </div>
      </main>

      {/* <ProfileFooter /> */}

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        open={showPaymentModal}
        onClose={handleClosePaymentModal}
        isLoading={paymentCallback.isPending}
        isSuccess={paymentCallback.isSuccess && !paymentCallback.isPending}
        error={paymentError}
      />
    </>
  );
}
