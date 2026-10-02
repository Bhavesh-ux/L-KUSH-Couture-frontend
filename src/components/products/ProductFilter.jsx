import React, { useState } from 'react';
import { Search, RotateCcw, X, SlidersHorizontal, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatters';

export const ProductFilter = ({
  categories = [],
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const availableSizes = ["38", "40", "42", "44", "46"];
  const availableColors = [
    { name: "Black", hex: "#0e0e10" },
    { name: "Navy", hex: "#1A2536" },
    { name: "Ivory", hex: "#FDFBF7" },
    { name: "Gold", hex: "#C5A059" },
    { name: "Maroon", hex: "#4A0E17" },
    { name: "Green", hex: "#114732" }
  ];

  const handleSizeToggle = (size) => {
    const current = filters.sizes || [];
    const updated = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    onFilterChange({ ...filters, sizes: updated });
  };

  const handleColorToggle = (colorName) => {
    const current = filters.colors || [];
    const updated = current.includes(colorName)
      ? current.filter((c) => c !== colorName)
      : [...current, colorName];
    onFilterChange({ ...filters, colors: updated });
  };

  const filterContent = (
    <div className="space-y-6 text-sm">
      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2">
          Search Attires
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Sherwani, Kurta, Silk..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-2.5" />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="border-t border-neutral-200 pt-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-3">
          Collections
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange({ ...filters, category: 'all' })}
            className={`w-full text-left px-2.5 py-1.5 text-xs transition-colors flex justify-between items-center ${
              !filters.category || filters.category === 'all'
                ? 'bg-luxury-gold-500/10 font-bold text-luxury-gold-800 border-l-2 border-luxury-gold-500'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <span>All Collections</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, category: cat.id })}
              className={`w-full text-left px-2.5 py-1.5 text-xs transition-colors flex justify-between items-center ${
                filters.category === cat.id
                  ? 'bg-luxury-gold-500/10 font-bold text-luxury-gold-800 border-l-2 border-luxury-gold-500'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <span>{cat.name}</span>
              {cat.itemCount && (
                <span className="text-[10px] text-neutral-400">({cat.itemCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t border-neutral-200 pt-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
            Price Range
          </label>
          <span className="text-xs font-bold text-luxury-gold-800">
            Up to {formatPrice(filters.maxPrice || 55000)}
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="55000"
          step="1000"
          value={filters.maxPrice || 55000}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-luxury-gold-500 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
          <span>₹5,000</span>
          <span>₹55,000</span>
        </div>
      </div>

      {/* Sizes */}
      <div className="border-t border-neutral-200 pt-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2.5">
          Sizes
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableSizes.map((size) => {
            const isSelected = (filters.sizes || []).includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`w-9 h-9 text-xs font-medium border flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-luxury-black text-white border-luxury-black font-bold'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="border-t border-neutral-200 pt-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2.5">
          Color Palette
        </label>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => {
            const isSelected = (filters.colors || []).includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => handleColorToggle(color.name)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs border rounded-none transition-all ${
                  isSelected
                    ? 'border-luxury-gold-500 bg-luxury-cream-100 font-bold text-neutral-900'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
                {isSelected && <Check className="w-3 h-3 text-luxury-gold-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* In Stock & Ratings */}
      <div className="border-t border-neutral-200 pt-5 space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
            className="accent-luxury-gold-500 w-4 h-4 cursor-pointer"
          />
          <span className="text-xs text-neutral-700 select-none">In Stock Attires Only</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.minRating === 4.8}
            onChange={(e) => onFilterChange({ ...filters, minRating: e.target.checked ? 4.8 : null })}
            className="accent-luxury-gold-500 w-4 h-4 cursor-pointer"
          />
          <span className="text-xs text-neutral-700 select-none">Top Rated (4.8+ Stars)</span>
        </label>
      </div>

      {/* Reset Action */}
      <div className="border-t border-neutral-200 pt-5">
        <button
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200 transition-colors uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Filter Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border border-neutral-200/80 p-5 shadow-sm sticky top-24 self-start">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-5">
          <h2 className="font-serif text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-luxury-gold-600" />
            <span>Refine Catalogue</span>
          </h2>
          <span className="text-xs text-neutral-400 font-sans">{totalResults} Pieces</span>
        </div>
        {filterContent}
      </aside>

      {/* Mobile Filter Drawer Button */}
      <div className="lg:hidden flex items-center justify-between bg-white border border-neutral-200 p-3 mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900"
        >
          <SlidersHorizontal className="w-4 h-4 text-luxury-gold-600" />
          <span>Filter & Refine ({totalResults})</span>
        </button>
        {((filters.sizes && filters.sizes.length > 0) || (filters.colors && filters.colors.length > 0) || filters.category !== 'all' || filters.search) && (
          <button
            onClick={onResetFilters}
            className="text-[11px] text-luxury-gold-700 font-semibold uppercase"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-luxury-cream-50">
              <span className="font-serif text-base font-bold text-neutral-900">Refine Garments</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">{filterContent}</div>
            <div className="p-4 border-t border-neutral-200 bg-neutral-50">
              <Button
                variant="gold"
                size="md"
                className="w-full"
                onClick={() => setMobileOpen(false)}
              >
                Apply Filters ({totalResults})
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
