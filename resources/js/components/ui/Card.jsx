import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-gov-card rounded-card border border-gov-border shadow-gov transition-all duration-200',
          hoverEffect && 'hover:shadow-gov-hover hover:border-slate-300',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
