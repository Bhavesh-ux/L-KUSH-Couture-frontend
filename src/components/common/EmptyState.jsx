import React from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white border border-neutral-200/80 shadow-sm max-w-lg mx-auto my-6 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-luxury-cream-100 flex items-center justify-center text-luxury-gold-600 mb-4 border border-luxury-gold-200">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-sm">{description}</p>
      {actionText && (
        actionLink ? (
          <Link to={actionLink}>
            <Button variant="gold" size="md">{actionText}</Button>
          </Link>
        ) : (
          <Button variant="gold" size="md" onClick={onActionClick}>{actionText}</Button>
        )
      )}
    </div>
  );
};
