import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching admin products:", err);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchProducts();

  const categoryFromUrl = searchParams.get('category');

  if (categoryFromUrl) {
    setCategoryFilter(categoryFromUrl);
  }
}, [searchParams]);

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you wish to delete "${name}" from the catalogue?`)) {
      await productService.deleteProduct(id);
      addToast(`Deleted ${name} from inventory.`, 'info');
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' ||
      p.categoryId === categoryFilter ||
      p.category.toLowerCase().replace(/\s+/g, '-') === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
            Inventory & Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Products Directory ({filteredProducts.length})
          </h1>
        </div>

        <Link to="/admin/products/add">
          <Button variant="gold" size="md" icon={PlusCircle}>
            Add New Garment
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID or silhouette..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-neutral-300 text-xs py-2 px-3 focus:outline-none focus:border-luxury-gold-500 text-neutral-800"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-neutral-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-luxury-cream-50 text-neutral-700 uppercase font-bold tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Garment</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Valuation</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50/70 transition-colors">
                  {/* Garment details */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-14 object-cover object-top border shrink-0"
                      />
                      <div>
                        <span className="text-[10px] text-neutral-400 font-mono block">
                          {product.id}
                        </span>
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="font-serif font-bold text-neutral-900 hover:text-luxury-gold-700 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <span className="text-[10px] text-neutral-500 block truncate max-w-xs">
                          {product.fabric || 'Pure Silk'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-neutral-600 font-medium">
                    {product.category}
                  </td>

                  {/* Valuation */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-neutral-900 font-sans">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[11px] text-neutral-400 line-through block">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        product.stock > 10
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : product.stock > 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                    </span>
                  </td>

                  {/* Badges */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {product.newArrival && (
                        <span className="bg-luxury-black text-luxury-gold-300 text-[9px] px-1.5 py-0.5 font-bold uppercase">
                          New
                        </span>
                      )}
                      {product.trending && (
                        <span className="bg-amber-100 text-amber-900 text-[9px] px-1.5 py-0.5 font-bold uppercase">
                          Trending
                        </span>
                      )}
                      {product.featured && (
                        <span className="bg-luxury-gold-100 text-luxury-gold-900 text-[9px] px-1.5 py-0.5 font-bold uppercase">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        to={`/product/${product.id}`}
                        target="_blank"
                        className="p-1.5 text-neutral-400 hover:text-neutral-900"
                        title="View Public Garment Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-1.5 text-neutral-400 hover:text-luxury-gold-700"
                        title="Edit Garment"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600"
                        title="Delete Garment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
