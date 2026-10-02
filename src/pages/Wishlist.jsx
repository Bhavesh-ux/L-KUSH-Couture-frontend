
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/products/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Heart, ArrowRight } from 'lucide-react';
import { wishlistService } from '../services/wishlistService';

export const Wishlist = () => {
  const {
    wishlist,
    loading: wishlistLoading,
  } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      setLoading(true);

      try {
        const wishlistItems =
          await wishlistService.getWishlist();

        const normalizedProducts =
          wishlistItems.map((item) => {
            const price =
              Number(item.price) || 0;

            const originalPrice =
              item.compare_price !== null &&
              item.compare_price !== undefined
                ? Number(item.compare_price)
                : price;

            const discount =
              originalPrice > price
                ? Math.round(
                    ((originalPrice - price) /
                      originalPrice) *
                      100
                  )
                : 0;

            return {
              id: String(item.product_id),

              name: item.name,

              category:
                item.category_name ||
                'Uncategorized',

              categoryId: item.category_id
                ? String(item.category_id)
                : null,

              description:
                item.description || '',

              price,
              originalPrice,
              discount,

              stock:
                Number(item.stock) || 0,

              images:
                Array.isArray(item.images)
                  ? item.images
                  : [],

              featured:
                Boolean(item.is_featured),

              rating: 0,
              reviewCount: 0,

              sizes:
                Array.isArray(item.sizes)
                  ? item.sizes
                  : [],

              colors:
                Array.isArray(item.colors)
                  ? item.colors
                  : [],

              newArrival: false,
              trending: false,

              tags: [],
              fabric: '',
              care: '',
              fit: '',
            };
          });

        setProducts(normalizedProducts);
      } catch (err) {
        console.error(
          'Error loading wishlist products:',
          err
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (!wishlistLoading) {
      loadWishlistProducts();
    }
  }, [wishlistLoading, wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-neutral-200 pb-5">
        <div>
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
            Private Atelier Selection
          </span>

          <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
            Your Wishlist ({wishlist.length})
          </h1>
        </div>

        <Link
          to="/shop"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-luxury-gold-700 hover:text-luxury-gold-800"
        >
          <span>Continue Discovering</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <LoadingSkeleton
          type="card"
          count={4}
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any couture creations yet. Explore our handcrafted sherwanis, festive kurtas, and blazers to curate your private favorites."
          actionText="Discover The Collections"
          actionLink="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};
