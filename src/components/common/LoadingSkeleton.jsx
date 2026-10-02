import React from 'react';

export const LoadingSkeleton = ({
  type = 'card', // 'card' | 'table' | 'text'
  count = 4,
  className = ''
}) => {
  if (type === 'card') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border border-neutral-200 p-3 animate-pulse">
            <div className="w-full aspect-[3/4] bg-neutral-200 mb-3" />
            <div className="h-4 bg-neutral-200 w-3/4 mb-2" />
            <div className="h-3 bg-neutral-100 w-1/2 mb-3" />
            <div className="h-5 bg-neutral-200 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-10 bg-neutral-200 w-full" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-12 bg-neutral-100 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      <div className="h-4 bg-neutral-200 w-full" />
      <div className="h-4 bg-neutral-200 w-5/6" />
      <div className="h-4 bg-neutral-200 w-4/6" />
    </div>
  );
};
