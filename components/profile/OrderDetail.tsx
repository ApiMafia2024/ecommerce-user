'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Order,
  OrderItem,
  OrderDeliveryAddress,
} from '@/types/order.types';
import { useTranslations } from 'next-intl';
import { Package, Download, MapPin, Map } from 'lucide-react';

interface OrderDetailProps {
  order: Order;
  className?: string;
}

function getStatusVariant(
  status: string
): 'completed' | 'pending' | 'shipped' | 'cancelled' | 'default' {
  const s = status?.toLowerCase() ?? '';
  if (s === 'completed' || s === 'delivered' || s === 'paid') return 'completed';
  if (s === 'shipped') return 'shipped';
  if (s === 'pending' || s === 'processing') return 'pending';
  if (s === 'cancelled') return 'cancelled';
  return 'default';
}

function StatusDot({ variant }: { variant: string }) {
  const dotClass =
    variant === 'completed'
      ? 'bg-emerald-500'
      : variant === 'shipped'
        ? 'bg-blue-500'
        : variant === 'pending'
          ? 'bg-amber-500'
          : variant === 'cancelled'
            ? 'bg-red-500'
            : 'bg-slate-500';
  return <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} aria-hidden />;
}

function formatPlacedAt(isoDate: string | undefined): string {
  if (!isoDate) return '';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoDate;
  }
}

function OrderItemTableRow({ item, index }: { item: OrderItem; index: number }) {
  const unitPrice = parseFloat(item.price) || 0;
  const subtotal = unitPrice * item.quantity;
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800 last:border-0">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-slate-400" aria-hidden />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Qty: {item.quantity}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-center">
        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.quantity}</span>
      </td>
      <td className="px-6 py-5">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          ${item.price}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          ${subtotal.toFixed(2)}
        </span>
      </td>
    </tr>
  );
}

function getPaymentStatusLabel(order: Order, t: (key: string) => string): string {
  const s = order.payment_status?.toLowerCase() ?? order.status?.toLowerCase() ?? '';
  if (['paid', 'completed', 'delivered'].includes(s)) return t('profile.orders.paidSuccessfully');
  if (['pending', 'processing'].includes(s)) return t('profile.orders.status.pending');
  if (s === 'cancelled') return t('profile.orders.status.cancelled');
  return order.payment_status ?? order.status ?? '—';
}

function getDeliveryStatusLabel(order: Order, t: (key: string) => string): string {
  const s = order.delivery_status?.toLowerCase() ?? order.status?.toLowerCase() ?? '';
  if (['completed', 'delivered'].includes(s)) return t('profile.orders.status.completed');
  if (s === 'shipped') return t('profile.orders.status.shipped');
  if (['pending', 'processing'].includes(s)) return t('profile.orders.status.pending');
  if (s === 'cancelled') return t('profile.orders.status.cancelled');
  return order.delivery_status ?? order.status ?? '—';
}

function hasAddress(addr: OrderDeliveryAddress | undefined): boolean {
  if (!addr) return false;
  return !!(
    addr.country ||
    addr.state ||
    addr.city ||
    addr.street_address
  );
}

export function OrderDetail({ order, className }: OrderDetailProps) {
  const t = useTranslations('Auth');
  const statusKey = order.status?.toLowerCase();
  const statusLabel =
    statusKey && ['completed', 'pending', 'processing', 'cancelled', 'shipped', 'delivered'].includes(statusKey)
      ? t(`profile.orders.status.${statusKey}` as 'profile.orders.status.completed')
      : order.status ?? '';
  const variant = getStatusVariant(order.status);
  const paymentVariant = getStatusVariant(order.payment_status ?? order.status);
  const deliveryVariant = getStatusVariant(order.delivery_status ?? order.status);
  const paymentLabel = getPaymentStatusLabel(order, t);
  const deliveryLabel = getDeliveryStatusLabel(order, t);
  const placedFormatted = formatPlacedAt(order.placed_at);
  const purchaseTypeLabel = order.purchase_type ?? t('profile.orders.standardPurchase');
  const address = order.delivery_address ?? order.shipping_address;
  const showDeliveryCard = hasAddress(address);

  return (
    <div className="space-y-6">
      {/* Order summary header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {t('profile.orders.orderNumber')} #{order.order_info}
            </h1>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full uppercase">
              {purchaseTypeLabel}
            </span>
          </div>
          {placedFormatted && (
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {t('profile.orders.placedOn', { date: placedFormatted })}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-extrabold text-slate-400">
              {t('profile.orders.paymentStatus')}
            </span>
            <Badge
              variant={paymentVariant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold w-fit"
            >
              <StatusDot variant={paymentVariant} />
              {paymentLabel}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-extrabold text-slate-400">
              {t('profile.orders.deliveryStatus')}
            </span>
            <Badge
              variant={deliveryVariant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold w-fit"
            >
              <StatusDot variant={deliveryVariant} />
              {deliveryLabel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Delivery Location card */}
      {showDeliveryCard && address && (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary shrink-0" aria-hidden />
              <h2 className="font-bold text-slate-900 dark:text-white">
                {t('profile.orders.deliveryLocation')}
              </h2>
            </div>
            {address.google_map_url && (
              <a
                href={address.google_map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Map className="w-4 h-4 shrink-0" aria-hidden />
                {t('profile.orders.viewOnGoogleMaps')}
              </a>
            )}
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {address.country != null && address.country !== '' && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    {t('profile.orders.country')}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {address.country}
                  </span>
                </div>
              )}
              {address.state != null && address.state !== '' && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    {t('profile.orders.stateProvince')}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {address.state}
                  </span>
                </div>
              )}
              {address.city != null && address.city !== '' && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    {t('profile.orders.city')}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {address.city}
                  </span>
                </div>
              )}
              {address.street_address != null && address.street_address !== '' && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    {t('profile.orders.streetAddress')}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {address.street_address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Transaction Items */}
      <Card className={className}>
        <CardHeader className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-bold text-slate-900 dark:text-white">
            {t('profile.orders.transactionItems')}
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.items?.length ? (
                  order.items.map((item, index) => (
                    <OrderItemTableRow key={`${item.name}-${index}`} item={item} index={index} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      {t('profile.orders.noItems')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6">
            <div className="flex flex-col items-end space-y-3">
              <div className="h-px bg-slate-200 dark:bg-slate-700 w-full max-w-xs my-2" />
              <div className="flex justify-between w-full max-w-xs">
                <span className="text-slate-900 dark:text-white font-extrabold text-lg">
                  {t('profile.orders.totalAmount')}
                </span>
                <span className="text-primary font-extrabold text-xl tracking-tight">
                  ${order.amount}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-end gap-3 pt-2">
        {/* <button
          type="button"
          className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-2"
          aria-label={t('profile.orders.downloadInvoice')}
        >
          <Download className="w-4 h-4 shrink-0" aria-hidden />
          {t('profile.orders.downloadInvoice')}
        </button> */}
      </div>
    </div>
  );
}
