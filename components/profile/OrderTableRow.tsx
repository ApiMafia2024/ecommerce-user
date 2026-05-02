'use client';

import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order.types';
import { useTranslations } from 'next-intl';

interface OrderTableRowProps {
  order: Order;
}

function getStatusVariant(
  status: string
): 'completed' | 'pending' | 'shipped' | 'cancelled' | 'default' {
  const s = status?.toLowerCase() ?? '';
  if (s === 'completed' || s === 'delivered') return 'completed';
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

export function OrderTableRow({ order }: OrderTableRowProps) {
  const t = useTranslations('Auth');
  const statusKey = order.status?.toLowerCase();
  const statusLabel =
    statusKey && ['completed', 'pending', 'processing', 'cancelled', 'shipped', 'delivered'].includes(statusKey)
      ? t(`profile.orders.status.${statusKey}` as 'profile.orders.status.completed')
      : order.status ?? '';
  const variant = getStatusVariant(order.status);

  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-5">
        <span className="font-bold text-slate-900 dark:text-white text-sm">
          #{order.order_info}
        </span>
      </td>
      <td className="px-6 py-5">
        <span className="text-sm text-slate-600 dark:text-slate-400">—</span>
      </td>
      <td className="px-6 py-5">
        <Badge
          variant={variant}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
        >
          <StatusDot variant={variant} />
          {statusLabel}
        </Badge>
      </td>
      <td className="px-6 py-5">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          ${order.amount}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <Link
          href={`/auth/profile/orders/${order.id}`}
          className="text-primary hover:text-orange-600 dark:hover:text-orange-400 text-sm font-bold transition-colors"
        >
          {t('profile.orders.viewDetails')}
        </Link>
      </td>
    </tr>
  );
}
