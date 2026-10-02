import React from 'react';

export const Button = ({
  children,
  variant = 'gold', // 'gold' | 'outline' | 'dark' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  loading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base tracking-wider'
  };

  const variantClasses = {
    gold: 'bg-gradient-to-r from-luxury-gold-400 via-luxury-gold-500 to-luxury-gold-600 text-luxury-black font-semibold hover:from-luxury-gold-300 hover:to-luxury-gold-500 shadow-gold-subtle hover:shadow-gold-glow border border-luxury-gold-400/30',
    outline: 'border border-luxury-gold-500/80 text-luxury-gold-600 hover:bg-luxury-gold-500 hover:text-luxury-black font-medium',
    dark: 'bg-luxury-black text-luxury-cream-100 hover:bg-luxury-charcoal border border-neutral-800 hover:border-luxury-gold-500/40 font-medium',
    ghost: 'text-neutral-700 hover:text-luxury-gold-600 hover:bg-luxury-cream-100/60 font-medium',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white font-medium'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center gap-2 tracking-wider uppercase transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};
