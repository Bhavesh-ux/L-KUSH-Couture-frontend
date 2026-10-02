import React, { useState, useEffect } from 'react';
import { recommendationService } from '../services/recommendationService';
import { ProductGrid } from '../components/products/ProductGrid';
import { TrendingUp, Flame, Sparkles } from 'lucide-react';

export const Trending = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const data = await recommendationService.getTrendingProducts(12);
        setTrendingProducts(data);
      } catch (err) {
        console.error("Error loading trending products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs uppercase tracking-widest font-bold">
          <Flame className="w-3.5 h-3.5 text-amber-600 fill-current" />
          <span>Most Desired Right Now</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
          Trending Now
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          The pieces capturing the most adoration across our virtual try-on studio, patron wishlists, and wedding inquiries this season.
        </p>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={trendingProducts}
        loading={loading}
        emptyTitle="Trending List Updating"
        emptyDescription="Our stylists are recalculating this week's favorite wedding and festive ensembles."
        columns={4}
      />
    </div>
  );
};
