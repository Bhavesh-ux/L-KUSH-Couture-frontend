import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Share2,
  Ruler,
  Star,
  Check,
  Shield,
  Truck,
  RotateCcw,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { productService } from '../services/productService';
import { recommendationService } from '../services/recommendationService';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { ProductCard } from '../components/products/ProductCard';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { trackEvent } from '../utils/analytics';
import {
  openWhatsAppCustom,
  createProductInquiryMessage
} from '../utils/whatsapp';

export const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('40');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      setError('');

      try {
        const prod = await productService.getProductById(productId);

        if (prod) {
          const imageUrls = Array.isArray(prod.images)
            ? prod.images.map((img) =>
                typeof img === 'string' ? img : img.image_url
              )
            : [];

          const normalizedProduct = {
            ...prod,
            images: imageUrls
          };

          setProduct(normalizedProduct);

          setSelectedImage(imageUrls[0] || '');
          setSelectedSize(prod.sizes?.[0] || '40');
          setSelectedColor(prod.colors?.[0]?.name || '');

          // Track product view
          trackEvent('product_view', {
            productId: prod.id,
            productName: prod.name,
            category: prod.category,
            price: prod.price
          });

          // Add to recently viewed history
          recommendationService.addRecentlyViewed(prod.id);

          // Fetch similar / related products
          const related = await recommendationService.getSimilarProducts(
            prod,
            4
          );

          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Error loading product:', err);

        setProduct(null);

        setError(
          err.message || 'Unable to load this garment right now.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center text-luxury-gold-600">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-luxury-gold-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
          Unable to Load Garment
        </h2>

        <p className="text-sm text-neutral-500 mb-6">
          {error}
        </p>

        <Button
          variant="gold"
          size="md"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
          Garment Not Found
        </h2>

        <p className="text-sm text-neutral-500 mb-6">
          The requested attire is unavailable or has been archived.
        </p>

        <Link to="/shop">
          <Button variant="gold" size="md">
            Return to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    alert('Add to cart clicked');

    addToCart(
      product,
      selectedSize,
      selectedColor,
      quantity
    );

    addToast(
      `Added ${quantity} × ${product.name} to Cart`,
      'success'
    );
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      selectedSize,
      selectedColor,
      quantity
    );

    navigate('/checkout');
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${product.name} | L-KUSH Couture`;
    const shareText = `Explore this bespoke ${product.name} from L-KUSH Couture.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });

        trackEvent('product_share', {
          productId: product.id,
          method: 'native'
        });

        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareUrl);

    addToast(
      'Direct link copied to clipboard!',
      'success'
    );

    trackEvent('product_share', {
      productId: product.id,
      method: 'clipboard'
    });
  };

  const handleWhatsAppInquiry = () => {
    const inquiryMsg = createProductInquiryMessage(product);
    openWhatsAppCustom(inquiryMsg);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
        <Link to="/" className="hover:text-neutral-900">
          Home
        </Link>

        <ChevronRight className="w-3.5 h-3.5" />

        <Link to="/shop" className="hover:text-neutral-900">
          Collections
        </Link>

        <ChevronRight className="w-3.5 h-3.5" />

        <Link
          to={`/category/${product.categoryId}`}
          className="hover:text-neutral-900"
        >
          {product.category}
        </Link>

        <ChevronRight className="w-3.5 h-3.5" />

        <span className="text-luxury-gold-800 font-bold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* Product Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 sm:w-20 aspect-[3/4] border overflow-hidden transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-luxury-gold-500 ring-1 ring-luxury-gold-500'
                      : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} angle ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="flex-1 relative aspect-[3/4] bg-neutral-100 overflow-hidden border border-neutral-200/90 shadow-sm">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
            />

            {/* AI Try-On Quick Trigger */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <Link
                to={`/try-on?productId=${product.id}`}
                className="inline-flex items-center gap-1.5 bg-luxury-black/90 backdrop-blur-xs text-luxury-gold-300 border border-luxury-gold-500/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-luxury-gold-500 hover:text-luxury-black transition-all shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-luxury-gold-400" />
                <span>Try With AI</span>
              </Link>
            </div>

            {product.discount > 0 && (
              <span className="absolute top-3 right-3 bg-luxury-gold-500 text-luxury-black font-bold px-2.5 py-1 text-xs uppercase tracking-wider shadow-sm">
                {product.discount}% Off
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-5 space-y-6">

          {/* Header */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold">
                {product.category}
              </span>

              <div className="flex items-center gap-1 text-amber-500 text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />

                <span className="font-bold text-neutral-800">
                  {product.rating}
                </span>

                <span className="text-neutral-400">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-1">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 font-sans">
                {formatPrice(product.price)}
              </span>

              {product.originalPrice > product.price && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}

              <span className="text-xs text-neutral-500">
                (Inclusive of all taxes & bespoke tailoring)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                  Select Hue:{' '}
                  <strong className="text-neutral-900 font-bold">
                    {selectedColor}
                  </strong>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs border transition-all ${
                      selectedColor === c.name
                        ? 'border-luxury-gold-500 bg-luxury-cream-100 font-semibold text-neutral-900'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-300"
                      style={{ backgroundColor: c.hex }}
                    />

                    <span>{c.name}</span>

                    {selectedColor === c.name && (
                      <Check className="w-3.5 h-3.5 text-luxury-gold-700" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                  Chest Size:{' '}
                  <strong className="text-neutral-900 font-bold">
                    {selectedSize}
                  </strong>
                </span>

                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs text-luxury-gold-700 hover:text-luxury-gold-900 font-semibold uppercase tracking-wider underline underline-offset-2"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-11 text-xs font-bold border flex items-center justify-center transition-all ${
                      selectedSize === sz
                        ? 'bg-luxury-black text-white border-luxury-black shadow-sm'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="border-t border-neutral-200 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                Quantity:
              </span>

              <div className="inline-flex border border-neutral-300 bg-white">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="px-3 py-1.5 text-sm hover:bg-neutral-100 text-neutral-600"
                >
                  -
                </button>

                <span className="px-3 py-1.5 text-xs font-bold min-w-[32px] text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-sm hover:bg-neutral-100 text-neutral-600"
                >
                  +
                </button>
              </div>
            </div>

            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
              {product.stock > 0
                ? `In Stock (${product.stock} pieces)`
                : 'Made to Order'}
            </span>
          </div>

          {/* Primary Actions */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-2 gap-3">

              <Button
                variant="gold"
                size="md"
                className="w-full"
                icon={ShoppingBag}
                onClick={handleAddToCart}
              >
                Add to Bag
              </Button>

              <Button
                variant="dark"
                size="md"
                className="w-full"
                onClick={handleBuyNow}
              >
                Order on WhatsApp
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">

              <Link
                to={`/try-on?productId=${product.id}`}
                className="w-full"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  icon={Sparkles}
                >
                  AI Virtual Try-On
                </Button>
              </Link>

              <button
                onClick={handleWhatsAppInquiry}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold uppercase tracking-wider border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Ask Stylist</span>
              </button>
            </div>
          </div>

          {/* Wishlist & Share */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 text-xs">
            <button
              onClick={() => {
                toggleWishlist(product);
                addToast(
                  isFavorited
                    ? 'Removed from Wishlist'
                    : 'Saved to Wishlist',
                  'success'
                );
              }}
              className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-rose-600 transition-colors font-medium"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited
                    ? 'fill-rose-600 text-rose-600'
                    : ''
                }`}
              />

              <span>
                {isFavorited
                  ? 'Saved in Wishlist'
                  : 'Add to Wishlist'}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900 transition-colors font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Ensemble</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-luxury-cream-50 p-4 border border-luxury-gold-300/30 space-y-2 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-luxury-gold-600 shrink-0" />
              <span>
                Premium Handloom Fabrics & Genuine Zari Craftsmanship
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-luxury-gold-600 shrink-0" />
              <span>
                Complimentary Insured Nationwide Dispatch
              </span>
            </div>

            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-luxury-gold-600 shrink-0" />
              <span>
                Complimentary Fitting Adjustments Within 7 Days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-neutral-200 pt-10">
        <div className="flex border-b border-neutral-200 gap-8 overflow-x-auto">
          {[
            {
              id: 'description',
              label: 'Artisan Craftsmanship'
            },
            {
              id: 'fabric',
              label: 'Fabric & Care'
            },
            {
              id: 'sizing',
              label: 'Bespoke Fitting Notes'
            },
            {
              id: 'reviews',
              label: `Client Reviews (${product.reviewCount})`
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs sm:text-sm uppercase font-bold tracking-widest whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-luxury-gold-500 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6 text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-3xl">

          {/* Description */}
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>{product.description}</p>

              <p>
                Each {product.name} is meticulously engineered in our
                ateliers. From the initial hand-drawn needlework
                blueprints to the final assembly of inner canvases,
                each stitch exemplifies traditional Indian ceremonial
                wear.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">

                <div className="bg-white p-3 border border-neutral-200">
                  <span className="text-[11px] text-neutral-400 uppercase font-semibold block">
                    Silhouette
                  </span>

                  <strong className="text-neutral-900">
                    {product.fit || 'Tailored Royal Cut'}
                  </strong>
                </div>

                <div className="bg-white p-3 border border-neutral-200">
                  <span className="text-[11px] text-neutral-400 uppercase font-semibold block">
                    Primary Textile
                  </span>

                  <strong className="text-neutral-900">
                    {product.fabric || 'Raw Tussar Silk'}
                  </strong>
                </div>

                <div className="bg-white p-3 border border-neutral-200">
                  <span className="text-[11px] text-neutral-400 uppercase font-semibold block">
                    Craft Tradition
                  </span>

                  <strong className="text-neutral-900">
                    {product.category}
                  </strong>
                </div>

              </div>
            </div>
          )}

          {/* Fabric */}
          {activeTab === 'fabric' && (
            <div className="space-y-3">
              <p>
                <strong>Fabrication:</strong>{' '}
                {product.fabric || 'Pure Mulberry Silk with Zari'}
              </p>

              <p>
                <strong>Maintenance:</strong>{' '}
                {product.care ||
                  'Dry Clean Only. Store in breathable muslin bag.'}
              </p>

              <p>
                Avoid direct spray of perfumes or alcohol-based
                fragrances on gold zardozi and metallic embroidery
                to protect natural luster over generations.
              </p>
            </div>
          )}

          {/* Sizing */}
          {activeTab === 'sizing' && (
            <div className="space-y-3">
              <p>
                Our menswear silhouettes are designed to provide
                authoritative posture with ample ease for movement
                and long ceremonial gatherings.
              </p>

              <p>
                Should you require custom sleeve length, broader
                shoulder canvas, or made-to-measure trousers, simply
                share your specific measurements with our master
                tailor during WhatsApp checkout.
              </p>

              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-luxury-gold-700 font-bold uppercase underline tracking-wider text-xs"
              >
                Open Full Sizing Chart
              </button>
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">

              <div className="flex items-center gap-4 bg-luxury-cream-50 p-4 border border-luxury-gold-300/30">

                <div className="text-center">
                  <span className="font-serif text-3xl font-bold text-neutral-900 block">
                    {product.rating}
                  </span>

                  <div className="flex text-amber-500 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-current"
                      />
                    ))}
                  </div>
                </div>

                <div className="border-l border-neutral-300 pl-4">
                  <span className="font-bold text-neutral-900 block">
                    Verified Atelier Reviews
                  </span>

                  <span className="text-xs text-neutral-500">
                    Based on {product.reviewCount} customer commissions
                  </span>
                </div>
              </div>

              {/* Review 1 */}
              <div className="space-y-4">

                <div className="border-b border-neutral-200 pb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-neutral-900">
                      Rohan K. (Verified Purchase)
                    </span>

                    <span className="text-neutral-400">
                      March 2026
                    </span>
                  </div>

                  <div className="flex text-amber-500 text-xs mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-neutral-600">
                    The drape of this {product.name} is exceptional.
                    Fabric weight and inner lining are first class.
                    Received compliments throughout the wedding
                    function.
                  </p>
                </div>

                {/* Review 2 */}
                <div className="border-b border-neutral-200 pb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-neutral-900">
                      Vikram S. (Verified Purchase)
                    </span>

                    <span className="text-neutral-400">
                      February 2026
                    </span>
                  </div>

                  <div className="flex text-amber-500 text-xs mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-neutral-600">
                    The direct WhatsApp ordering gave me peace of
                    mind. The owner confirmed my shoulder measurements
                    before dispatch. Highly recommended!
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-neutral-200 pt-12 space-y-6">

          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
                Complementary Ensembles
              </span>

              <h3 className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">
                You May Also Adore
              </h3>
            </div>

            <Link
              to={`/category/${product.categoryId}`}
              className="text-xs font-bold uppercase tracking-wider text-luxury-gold-700 hover:text-luxury-gold-800"
            >
              View More in {product.category}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

    </div>
  );
};