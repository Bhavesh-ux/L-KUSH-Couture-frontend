import React from 'react';

export const Badge = ({
  children,
  variant = 'gold', // 'gold' | 'dark' | 'outline' | 'success' | 'warning' | 'danger'
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider',
    sm: 'px-2.5 py-1 text-xs tracking-wider uppercase font-medium',
    md: 'px-3 py-1.5 text-xs tracking-wider uppercase font-medium'
  };

  const variantClasses = {
    gold: 'bg-luxury-gold-100 text-luxury-gold-900 border border-luxury-gold-300',
    dark: 'bg-luxury-black text-luxury-gold-300 border border-luxury-gold-500/30',
    outline: 'border border-luxury-gold-500 text-luxury-gold-700 bg-white/60',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
