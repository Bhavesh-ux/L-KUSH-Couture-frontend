import React, { useState, useEffect } from 'react';
import { recommendationService } from '../services/recommendationService';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/products/ProductCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Sparkles, Heart, Clock, TrendingUp, Compass } from 'lucide-react';

export const Recommendations = () => {
  const { wishlist } = useWishlist();
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [wishlistBased, setWishlistBased] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const [recent, wishlistRecs, popular, trending] = await Promise.all([
          recommendationService.getRecentlyViewed(),
          recommendationService.getWishlistRecommendations(wishlist),
          recommendationService.getPopularProducts(4),
          recommendationService.getTrendingProducts(4)
        ]);

        setRecentlyViewed(recent);
        setWishlistBased(wishlistRecs);
        setPopularProducts(popular);
        setTrendingProducts(trending);
      } catch (err) {
        console.error("Error loading recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold-500/10 border border-luxury-gold-500/30 text-luxury-gold-700 text-xs uppercase tracking-widest font-bold">
          <Sparkles className="w-3.5 h-3.5 text-luxury-gold-600" />
          <span>Curated For Your Taste</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
          Personalized Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Algorithmic styling suggestions generated from your viewing patterns, wishlist preferences, and festive attire favorites.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : (
        <div className="space-y-16">
          {/* Section 1: Based on Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                <Clock className="w-4 h-4 text-luxury-gold-700" />
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  Pick Up Where You Left Off
                </h2>
                <span className="text-xs text-neutral-400 font-sans ml-auto">Recently Explored</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {recentlyViewed.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Based on Wishlist */}
          {wishlistBased.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                <Heart className="w-4 h-4 text-rose-600" />
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  Inspired by Your Wishlist
                </h2>
                <span className="text-xs text-neutral-400 font-sans ml-auto">Similar Silhouettes</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {wishlistBased.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Trending Ensembles */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Trending in the Ateliers
              </h2>
              <span className="text-xs text-neutral-400 font-sans ml-auto">High Activity</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {trendingProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Section 4: Most Popular Compositions */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
              <Compass className="w-4 h-4 text-luxury-gold-700" />
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Patron Favorites & Hall of Fame
              </h2>
              <span className="text-xs text-neutral-400 font-sans ml-auto">Top Rated</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {popularProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
