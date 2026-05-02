'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Footer } from '@/components/shared/Footer';
import { useCart } from '@/hooks/useCart';
import { useProfile } from '@/hooks/queries/useProfile';
import { usePaymentMutation, PaymentRequest } from '@/hooks/mutations/usePaymentMutation';
import { ChevronDown, Wallet, DollarSign, CheckCircle2, Shield, Headphones, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import CartSkeletonLoader from '@/components/cart/CartSkeletonLoader';
import { Location } from '@/types/api.types';

const CheckoutPage = () => {
  const { items: cartItems, cartId, isLoading } = useCart();
  const { data: profileResponse, isLoading: isLoadingProfile } = useProfile();
  const profile = profileResponse?.data;
  const locations: Location[] = useMemo(() => {
    return profile?.locations || [];
  }, [profile?.locations]);
  const t = useTranslations('Checkout');
  const paymentMutation = usePaymentMutation();
  
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    country: '',
    state: '',
    city: '',
    street: '',
    googleMapUrl: '',
  });

  // Compute the actual selected value - default to first location if available and nothing selected
  const selectedAddressValue = selectedAddress || (locations.length > 0 ? '0' : '');

  // Format address for display
  const formatAddress = (location: Location, index: number) => {
    const parts = [location.street, location.city, location.state, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : `${t('addresses.address')} ${index + 1}`;
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const breadcrumbItems = [
    { label: t('breadcrumbs.home'), href: '/' },
    { label: t('breadcrumbs.cart'), href: '/cart' },
    { label: t('breadcrumbs.checkout') },
  ];

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAddress(value);
    setShowNewAddressForm(value === 'new');
    
    // If selecting an existing address, populate the form (for editing/viewing)
    if (value !== 'new' && value !== '') {
      const index = parseInt(value);
      const location = locations[index];
      if (location) {
        setNewAddress({
          country: location.country || '',
          state: location.state || '',
          city: location.city || '',
          street: location.street || '',
          googleMapUrl: location.google_map_url || '',
        });
      }
    } else {
      // Clear form when selecting "new" or empty
      setNewAddress({
        country: '',
        state: '',
        city: '',
        street: '',
        googleMapUrl: '',
      });
    }
  };

  const handlePlaceOrder = () => {
    // Validate that address is selected or new address form is filled
    if (selectedAddressValue === '' || selectedAddressValue === 'new') {
      if (!newAddress.street || !newAddress.city || !newAddress.country) {
        toast.error(t('addressRequired') || 'Please provide a complete address');
        return;
      }
    }

    // Build payment request
    const paymentType = paymentMethod === 'online' ? 'online' : 'cash_on_delivery';
    const paymentData: PaymentRequest = {
      type: paymentType,
    };

    // Add cart_id if available
    if (cartId) {
      paymentData.cart_id = cartId;
    }

    // Handle location - either location_id or location fields
    if (selectedAddressValue === 'new') {
      // User wrote address manually
      paymentData.location = {
        country: newAddress.country,
        city: newAddress.city,
        state: newAddress.state,
        street: newAddress.street,
        google_map_url: newAddress.googleMapUrl,
      };
    } else if (selectedAddressValue !== '') {
      // User selected existing location
      const index = parseInt(selectedAddressValue);
      const selectedLocation = locations[index];
      if (selectedLocation?.id) {
        paymentData.location_id = selectedLocation.id;
      } else {
        // If location doesn't have id, send location fields
        paymentData.location = {
          country: selectedLocation.country,
          city: selectedLocation.city,
          state: selectedLocation.state,
          street: selectedLocation.street,
          google_map_url: selectedLocation.google_map_url,
        };
      }
    }

    // Call payment mutation
    paymentMutation.mutate(paymentData);
  };

  if (isLoading || isLoadingProfile) {
    return <CartSkeletonLoader />;
  }

  if (cartItems.length === 0) {
    return (
      <>
        <main className="max-w-[1280px] mx-auto px-6 py-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          <div className="text-center py-16">
            <p className="text-[#8a7560] dark:text-gray-400">{t('emptyCart')}</p>
            <Link href="/cart">
              <Button className="mt-4">{t('backToCart')}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight mb-2 text-[#181411] dark:text-white">
            {t('title')}
          </h1>
          <p className="text-[#8a7560] dark:text-gray-400">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Delivery Address & Payment */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Delivery Address Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="size-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <h2 className="text-xl font-bold text-[#181411] dark:text-white">
                  {t('deliveryAddress')}
                </h2>
              </div>
              <div className="bg-white dark:bg-background-dark/40 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <div className="relative">
                  <label
                    className="block text-xs font-bold text-[#8a7560] uppercase tracking-wider mb-2"
                    htmlFor="address-select"
                  >
                    {t('selectShippingAddress')}
                  </label>
                  <select
                    id="address-select"
                    value={selectedAddressValue}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-white dark:bg-[#2a1f14] border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm appearance-none cursor-pointer text-[#181411] dark:text-white"
                  >
                    {locations.length === 0 && (
                      <option value="" disabled>
                        {t('noAddresses')}
                      </option>
                    )}
                    {locations.map((location, index) => (
                      <option key={index} value={index.toString()}>
                        {formatAddress(location, index)}
                      </option>
                    ))}
                    <option value="new">{t('addNewAddress')}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6">
                    <ChevronDown className="w-5 h-5 text-[#8a7560]" />
                  </div>
                </div>

                {/* New Address Form */}
                {showNewAddressForm && (
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
                      {t('newDeliveryDetails')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      <div className="relative mt-6">
                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#2a1f14] px-1 text-xs font-semibold text-primary z-10">
                          {t('country')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. United States"
                          value={newAddress.country}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, country: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white dark:bg-background-dark/40 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm transition-all text-[#181411] dark:text-white"
                        />
                      </div>
                      <div className="relative mt-6">
                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#2a1f14] px-1 text-xs font-semibold text-primary z-10">
                          {t('stateProvince')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. California"
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, state: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white dark:bg-background-dark/40 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm transition-all text-[#181411] dark:text-white"
                        />
                      </div>
                      <div className="relative mt-6">
                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#2a1f14] px-1 text-xs font-semibold text-primary z-10">
                          {t('city')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. San Jose"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white dark:bg-background-dark/40 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm transition-all text-[#181411] dark:text-white"
                        />
                      </div>
                      <div className="relative mt-6">
                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#2a1f14] px-1 text-xs font-semibold text-primary z-10">
                          {t('streetAddress')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 123 Tech Lane"
                          value={newAddress.street}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, street: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white dark:bg-background-dark/40 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm transition-all text-[#181411] dark:text-white"
                        />
                      </div>
                      <div className="relative mt-6 md:col-span-2">
                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#2a1f14] px-1 text-xs font-semibold text-primary z-10">
                          {t('googleMapUrl')}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="https://goo.gl/maps/..."
                            value={newAddress.googleMapUrl}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, googleMapUrl: e.target.value })
                            }
                            className="w-full px-4 py-3 pl-10 bg-white dark:bg-background-dark/40 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm transition-all text-[#181411] dark:text-white"
                          />
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 text-lg" />
                        </div>
                        <p className="text-[10px] text-[#8a7560] mt-1.5 ml-1">
                          {t('googleMapUrlHint')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Payment Method Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="size-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <h2 className="text-xl font-bold text-[#181411] dark:text-white">
                  {t('paymentMethod')}
                </h2>
              </div>
              <div className="space-y-4">
                <label
                  className={`payment-card cursor-pointer flex items-center gap-4 p-5 bg-white dark:bg-background-dark/40 border rounded-xl hover:shadow-md transition-all ${
                    paymentMethod === 'online'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="size-5 text-primary focus:ring-primary border-gray-300"
                  />
                  <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Wallet className="text-primary text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#181411] dark:text-white">
                      {t('onlinePayment')}
                    </h4>
                    <p className="text-xs text-[#8a7560]">
                      {t('onlinePaymentDescription')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <img
                      alt="Visa"
                      className="h-4 opacity-70"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAny-jGrukpN-DTOIcjkGBIm4RI4MRZAvQ_3g6lj3sUpdVJrobI-VGWG30d4x8YCbwsaGJe5xD7VIVJ1keoG6rJx9ebrz5rlMbWt3UbYldh-cMVve-HUaH-Gc36z9GQN5IQrXdTeAZvi4CrvgGS3Fg9OpBJa82GHPVFZF6rLNmTjRIsg4lIqkzGWitlw9R8kqjCeTUsYYkdsG4w_p94dEQbyH0AMAzUcZOhs4pd1N08ImBsPh5bkcbKTZh2akdXoS__cgYEuy9Ig"
                    />
                    <img
                      alt="PayPal"
                      className="h-4 opacity-70"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaktpcTQOTuLyYhuBtBYUxShLpcYb8NzlXHwE5rPusUUFB4LMTuxKniVkG5zbKLsfIwbSebI7j6DFIVDd7pa1CPyk5c8SpckBtoHFIBgTWR4BBGwLI2gJPmRNx-oF05AbFEEqR495LdFrJH70uUC50U5fGrbgT1VD-YpJFkxJnbMcKnlZIxrghV5FffrsxtY96Jj7T7sWna-PcAmMbQIZFzYGShaMsf6N-3j61Mb3HVGSPASH2A2uwV714Y0qyW5UkYyPWhfi9Jg"
                    />
                  </div>
                </label>
                <label
                  className={`payment-card cursor-pointer flex items-center gap-4 p-5 bg-white dark:bg-background-dark/40 border rounded-xl hover:shadow-md transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="size-5 text-primary focus:ring-primary border-gray-300"
                  />
                  <div className="size-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-gray-500 text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#181411] dark:text-white">
                      {t('cashOnDelivery')}
                    </h4>
                    <p className="text-xs text-[#8a7560]">
                      {t('cashOnDeliveryDescription')}
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-background-dark/40 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-[#181411] dark:text-white">
                {t('orderSummary')}
              </h2>
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8a7560] dark:text-gray-400">
                    {t('items', { count: itemCount })}
                  </span>
                  <Link
                    href="/cart"
                    className="text-primary font-bold hover:underline"
                  >
                    {t('viewItems')}
                  </Link>
                </div>
              </div>
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex justify-between">
                  <span className="text-[#8a7560] dark:text-gray-400">{t('subtotal')}</span>
                  <span className="font-semibold text-[#181411] dark:text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a7560] dark:text-gray-400">{t('shipping')}</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {t('free')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a7560] dark:text-gray-400">{t('estimatedTax')}</span>
                  <span className="font-semibold text-[#181411] dark:text-white">
                    ${tax.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-between mb-8">
                <span className="text-lg font-bold text-[#181411] dark:text-white">
                  {t('totalAmount')}
                </span>
                <div className="text-right">
                  <p className="text-3xl font-black text-primary">${total.toFixed(2)}</p>
                  <p className="text-xs text-[#8a7560] dark:text-gray-400 mt-1">
                    {t('pricesIncludeTax')}
                  </p>
                </div>
              </div>
              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
                disabled={paymentMutation.isPending}
              >
                {paymentMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    {t('placeOrder')}
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </Button>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center justify-center gap-3 text-[#8a7560] dark:text-gray-400">
                  <Shield className="w-5 h-5" />
                  <span className="text-xs font-medium">{t('secureTransaction')}</span>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-[10px] text-[#8a7560] dark:text-gray-400 leading-tight text-center">
                    {t('termsNotice')}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 flex items-center gap-4 bg-white dark:bg-background-dark/40 border border-gray-100 dark:border-gray-800 rounded-xl">
              <Headphones className="text-primary" />
              <div>
                <p className="text-xs font-bold text-[#181411] dark:text-white">
                  {t('needHelp')}
                </p>
                <p className="text-[11px] text-[#8a7560] dark:text-gray-400">
                  {t('supportPhone')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;

