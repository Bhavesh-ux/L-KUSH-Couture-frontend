
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductFilter } from '../components/products/ProductFilter';
import { ProductGrid } from '../components/products/ProductGrid';
import { EmptyState } from '../components/common/EmptyState';
import { ArrowUpDown, AlertCircle } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize filters from URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    maxPrice: Number(searchParams.get('maxPrice')) || 55000,
    sizes: searchParams.getAll('size') || [],
    colors: searchParams.getAll('color') || [],
    sortBy: searchParams.get('sortBy') || 'featured',
    inStockOnly: searchParams.get('inStock') === 'true',
    minRating: searchParams.get('minRating')
      ? Number(searchParams.get('minRating'))
      : null
  });

  // Sync state if URL query params change externally
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    const urlSort = searchParams.get('sortBy');

    setFilters((prev) => ({
      ...prev,
      category: urlCategory || prev.category,
      search: urlSearch !== null ? urlSearch : prev.search,
      sortBy: urlSort || prev.sortBy
    }));
  }, [searchParams]);

  // Load initial categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await productService.getProducts(filters);

        setProducts(data);

        // Track search analytics if query present
        if (filters.search) {
          trackEvent('search', {
            query: filters.search,
            resultCount: data.length
          });
        }
      } catch (err) {
        console.error('Error filtering products:', err);

        setProducts([]);

        setError(
          err.message ||
            'Unable to load products right now. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      maxPrice: 55000,
      sizes: [],
      colors: [],
      sortBy: 'featured',
      inStockOnly: false,
      minRating: null
    });

    setSearchParams({});
  };

  const handleRetry = () => {
    // Create a new filter object so the useEffect runs again
    setFilters((prev) => ({
      ...prev
    }));
  };

  const currentCategoryObj = categories.find(
    (c) => c.id === filters.category
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
              {currentCategoryObj
                ? currentCategoryObj.name
                : 'The Complete Atelier'}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              {currentCategoryObj
                ? currentCategoryObj.name
                : 'Indian Couture Collection'}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
              {currentCategoryObj
                ? currentCategoryObj.description
                : 'Browse our signature sherwanis, festive kurtas, and tailored bandhgalas crafted with pure silks and heirloom embroidery.'}
            </p>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium whitespace-nowrap flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort By:
            </span>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  sortBy: e.target.value
                })
              }
              className="bg-white border border-neutral-300 text-xs py-2 px-3 focus:outline-none focus:border-luxury-gold-500 font-medium text-neutral-800"
            >
              <option value="featured">Featured Ensembles</option>
              <option value="newest">New Arrivals</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending Now</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filter Controls */}
        <ProductFilter
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={products.length}
        />

        {/* Product Catalog Grid */}
        <div className="flex-1 w-full">
          {error ? (
            <EmptyState
              icon={AlertCircle}
              title="Unable to Load Collection"
              description={error}
              actionText="Try Again"
              onActionClick={handleRetry}
            />
          ) : (
            <ProductGrid
              products={products}
              loading={loading}
              emptyTitle="No Matching Attires"
              emptyDescription="We couldn't find any garments matching your active filter criteria. Try adjusting the price range or resetting filters."
              columns={3}
            />
          )}
        </div>
      </div>
    </div>
  );
};
