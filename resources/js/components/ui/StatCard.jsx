import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import { clsx } from 'clsx';

export default function StatCard({
  title,
  value = 0,
  icon: Icon,
  color = 'primary',
  subtitle,
  onClick,
  badge,
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 800; // ms
    const increment = Math.ceil(end / (duration / 25));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [value]);

  const colorStyles = {
    primary: {
      bgIcon: 'bg-primary/10 text-primary',
      borderLeft: 'border-l-4 border-l-primary',
    },
    secondary: {
      bgIcon: 'bg-secondary/10 text-secondary',
      borderLeft: 'border-l-4 border-l-secondary',
    },
    accent: {
      bgIcon: 'bg-amber-100 text-amber-800',
      borderLeft: 'border-l-4 border-l-accent',
    },
    success: {
      bgIcon: 'bg-emerald-100 text-emerald-700',
      borderLeft: 'border-l-4 border-l-emerald-500',
    },
    danger: {
      bgIcon: 'bg-rose-100 text-rose-700',
      borderLeft: 'border-l-4 border-l-rose-500',
    },
  };

  const currentStyle = colorStyles[color] || colorStyles.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={onClick ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={clsx(onClick && 'cursor-pointer')}
    >
      <Card className={clsx('p-5 overflow-hidden', currentStyle.borderLeft, onClick && 'hover:shadow-gov-hover')}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900">{displayValue}</span>
              {badge && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {Icon && (
            <div className={clsx('p-3 rounded-card shrink-0', currentStyle.bgIcon)}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
