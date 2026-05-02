'use client';

import { Loader2 } from 'lucide-react';

type Props = {
  visible: boolean;
  fadeMs?: number;
};

export default function GlobalLoadingOverlay({ visible, fadeMs = 150 }: Props) {
  return (
    <div
      className={[
        'fixed inset-0 z-[100] flex h-screen w-full items-center justify-center',
        'bg-white dark:bg-black',
        'transition-opacity',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
      style={{ transitionDuration: `${fadeMs}ms` }}
    >
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-white" />
    </div>
  );
}

