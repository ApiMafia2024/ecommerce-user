'use client';

import { OrderItem } from '@/types/order.types';
import { cn } from '@/lib/utils';

interface OrderItemRowProps {
  item: OrderItem;
  className?: string;
}

export function OrderItemRow({ item, className }: OrderItemRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {item.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Qty: {item.quantity}
        </p>
      </div>
      <p className="text-sm font-semibold text-slate-900 dark:text-white shrink-0">
        ${item.price}
      </p>
    </div>
  );
}
