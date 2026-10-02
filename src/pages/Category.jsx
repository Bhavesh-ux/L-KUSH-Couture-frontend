import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import { ProductGrid } from '../components/products/ProductGrid';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export const Category = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        const cat = await categoryService.getCategoryById(categoryId);
        setCategory(cat);

        const prods = await productService.getProducts({
  category: cat.slug,
  sortBy
});
        setProducts(prods);

        trackEvent('category_view', {
          categoryId,
          categoryName: cat?.name || categoryId,
          productCount: prods.length
        });
      } catch (err) {
        console.error("Error loading category:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryData();
  }, [categoryId, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
        <Link to="/" className="hover:text-neutral-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-neutral-900">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-luxury-gold-800 font-bold">{category?.name || categoryId}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative aspect-[21/9] sm:aspect-[24/8] bg-luxury-black overflow-hidden border border-neutral-200/80 shadow-sm flex items-center">
        {category?.image && (
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/80 to-transparent" />

        <div className="relative z-10 p-6 sm:p-12 max-w-xl text-white space-y-3">
          <span className="text-xs uppercase tracking-widest text-luxury-gold-400 font-bold">
            Curated Atelier Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            {category?.name || 'Collection'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-2">
            {category?.description || 'Explore bespoke handcrafted couture.'}
          </p>
          <span className="inline-block text-xs text-luxury-gold-300 font-semibold bg-luxury-black/60 px-2.5 py-1 border border-luxury-gold-500/30">
            {products.length} Designs Available
          </span>
        </div>
      </div>

      {/* Sort & Grid Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-luxury-gold-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Collections</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-neutral-300 text-xs py-1.5 px-3 focus:outline-none focus:border-luxury-gold-500 text-neutral-800"
          >
            <option value="featured">Featured</option>
            <option value="newest">New Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Popularity</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        emptyTitle={`No ${category?.name || 'garments'} found`}
        emptyDescription="We are currently crafting new designs for this collection. Please browse our other ateliers."
        columns={4}
      />
    </div>
  );
};
