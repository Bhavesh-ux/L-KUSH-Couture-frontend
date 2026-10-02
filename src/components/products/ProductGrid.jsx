import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';
import { ShoppingBag } from 'lucide-react';

export const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle = "No Garments Found",
  emptyDescription = "We couldn't find any attires matching your chosen criteria. Try adjusting your filters.",
  columns = 4 // 2 | 3 | 4
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (loading) {
    return <LoadingSkeleton type="card" count={columns * 2} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }[columns] || 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <>
      <div className={`grid ${gridColsClass} gap-4 sm:gap-6`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
};
