import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Badge({
  children,
  className = '',
  dotColor,
  variant = 'default',
  size = 'md',
}) {
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-medium rounded-full border',
          sizes[size],
          className
        )
      )}
    >
      {dotColor && (
        <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColor)} />
      )}
      {children}
    </span>
  );
}
