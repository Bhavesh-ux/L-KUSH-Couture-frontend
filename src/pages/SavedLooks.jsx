import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tryOnService } from '../services/tryOnService';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/common/Toast';
import { formatDateTime, formatPrice } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  Clock
} from 'lucide-react';

export const SavedLooks = () => {
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const fetchLooks = async () => {
    setLoading(true);
    try {
      const data = await tryOnService.getSavedLooks();
      setLooks(data);
    } catch (err) {
      console.error("Error loading saved looks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLooks();
  }, []);

  const handleDelete = async (lookId) => {
    await tryOnService.deleteSavedLook(lookId);
    addToast("Look removed from lookbook.", "info");
    fetchLooks();
  };

  const handleAddLookProductToCart = async (productId) => {
    const product = await productService.getProductById(productId);
    if (product) {
      addToCart(product, product.sizes?.[0] || '40', product.colors?.[0]?.name, 1);
      addToast(`Added ${product.name} to Cart`, 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-neutral-200 pb-5">
        <div>
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
            Private Studio Lookbook
          </span>
          <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
            Saved AI Try-On Looks ({looks.length})
          </h1>
        </div>
        <Link to="/try-on">
          <Button variant="gold" size="sm" icon={Sparkles}>
            Try New Attire
          </Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : looks.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No Saved Looks in Lookbook"
          description="You haven't saved any AI Virtual Try-On results yet. Step into our Virtual Fitting Studio, upload your portrait, and save your favorite styling configurations."
          actionText="Open AI Try-On Studio"
          actionLink="/try-on"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {looks.map((look) => (
            <div
              key={look.id}
              className="bg-white border border-neutral-200/90 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Composite split view */}
              <div className="relative aspect-[4/3] bg-neutral-900 grid grid-cols-2">
                <img
                  src={look.customerPhoto}
                  alt="Customer Portrait"
                  className="w-full h-full object-cover border-r border-neutral-800"
                />
                <img
                  src={look.resultImage || look.productImage}
                  alt={look.productName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-luxury-black/80 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                  Original
                </div>
                <div className="absolute top-2 right-2 bg-luxury-gold-500 px-2 py-0.5 text-[9px] font-bold text-luxury-black uppercase tracking-wider">
                  AI Fit
                </div>
              </div>

              {/* Look Info */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(look.date)}
                    </span>
                    <button
                      onClick={() => handleDelete(look.id)}
                      className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                      title="Delete look"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to={`/product/${look.productId}`}
                    className="font-serif font-bold text-base text-neutral-900 hover:text-luxury-gold-700 transition-colors line-clamp-1"
                  >
                    {look.productName}
                  </Link>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {look.notes || "Bespoke Royal Fit Simulation"}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-neutral-100 flex gap-2">
                  <Button
                    variant="gold"
                    size="sm"
                    className="flex-1"
                    icon={ShoppingBag}
                    onClick={() => handleAddLookProductToCart(look.productId)}
                  >
                    Add to Cart
                  </Button>
                  <Link
                    to={`/product/${look.productId}`}
                    className="p-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 transition-colors"
                    title="View Garment"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
