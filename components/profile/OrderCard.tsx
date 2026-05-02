'use client';

import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order.types';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  className?: string;
}

function getStatusVariant(status: string): 'completed' | 'pending' | 'default' {
  const s = status?.toLowerCase() ?? '';
  if (s === 'completed' || s === 'delivered') return 'completed';
  if (s === 'pending' || s === 'processing') return 'pending';
  return 'default';
}

export function OrderCard({ order, className }: OrderCardProps) {
  const t = useTranslations('Auth');
  const statusKey = order.status?.toLowerCase();
  const statusLabel =
    statusKey && ['completed', 'pending', 'processing', 'cancelled'].includes(statusKey)
      ? t(`profile.orders.status.${statusKey}` as 'profile.orders.status.completed')
      : order.status ?? '';
  const variant = getStatusVariant(order.status);

  return (
    <Link
      href={`/auth/profile/orders/${order.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-2xl"
      aria-label={`${t('profile.orders.orderNumber')} ${order.order_info}`}
    >
      <Card
        className={cn(
          'transition-shadow hover:shadow-md border-slate-200 dark:border-slate-700',
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            #{order.order_info}
          </span>
          <Badge variant={variant}>{statusLabel}</Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ${order.amount}
            </span>
            <ChevronRight className="w-5 h-5 text-slate-400" aria-hidden />
          </div>
          {order.items?.length > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {order.items.length} {t('profile.orders.items')}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
