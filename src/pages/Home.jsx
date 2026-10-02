
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Scissors,
  Star,
  ChevronRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import { Button } from '../components/common/Button';
import { ProductCard } from '../components/products/ProductCard';
import { QuickViewModal } from '../components/products/QuickViewModal';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { recommendationService } from '../services/recommendationService';
import { openWhatsAppCustom } from '../utils/whatsapp';

export const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [cats, products, trending, recents] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts({ sortBy: 'newest' }),
          recommendationService.getTrendingProducts(4),
          recommendationService.getRecentlyViewed()
        ]);

        console.log('HOME CATEGORIES:', cats);

        setCategories(cats.slice(0, 8));
        setNewArrivals(products.slice(0, 8));
        setTrendingProducts(trending);
        setRecentlyViewed(recents.slice(0, 4));
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const testimonials = [
    {
      id: 1,
      quote:
        'The craftsmanship of the midnight velvet sherwani is beyond comparison. The zardozi embroidery caught the light magnificently during my wedding reception.',
      author: 'Vikramaditya S.',
      city: 'New Delhi',
      occasion: 'Groom Wedding Ensemble',
      rating: 5
    },
    {
      id: 2,
      quote:
        'The WhatsApp concierge gave me absolute confidence in the drape and silhouette before ordering. Every custom measurement inquiry was answered within minutes.',
      author: 'Aarav S.',
      city: 'Mumbai',
      occasion: 'Sangeet Celebration',
      rating: 5
    },
    {
      id: 3,
      quote:
        'Unmatched cut and fabric quality. The pure raw silk kurta set feels luxurious, breathable, and unmistakably bespoke.',
      author: 'Devendra R.',
      city: 'Jodhpur',
      occasion: 'Festive Occasion',
      rating: 5
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">

      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] bg-luxury-black text-white flex items-center overflow-hidden">

        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=2000&q=85"
            alt="L-KUSH Couture Menswear"
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-pulse duration-10000"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">

            {/* Crest & Subtitle */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold-500/10 border border-luxury-gold-500/30 text-luxury-gold-400 text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modern Indian Sartorial Grandeur</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Timeless Style. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold-300 via-luxury-gold-400 to-luxury-gold-200">
                Contemporary Tradition.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
              Elevating Indian occasion wear through architectural silhouettes, pure mulberry silks, and meticulous antique gold zardozi embroidery.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/shop">
                <Button
                  variant="gold"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Shop Collection
                </Button>
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-neutral-800/80 max-w-lg text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-luxury-gold-400 shrink-0" />
                <span>Bespoke Fits</span>
              </div>

              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-luxury-gold-400 shrink-0" />
                <span>Pure Silks</span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-luxury-gold-400 shrink-0" />
                <span>Concierge Order</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-2">
            Curated Collections
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Explore by Silhouette & Occasion
          </h2>

          <div className="w-12 h-0.5 bg-luxury-gold-500 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-xs"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/30 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end text-white transition-transform duration-300">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold-400 font-semibold mb-1">
                  {cat.itemCount || 8} Ensembles
                </span>

                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight mb-1 text-white group-hover:text-luxury-gold-300 transition-colors">
                  {cat.name}
                </h3>

                <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                  {cat.description}
                </p>

                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-luxury-gold-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
              Fresh Off The Ateliers
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              New Season Debuts
            </h2>
          </div>

          <Link
            to="/shop?category=new-arrivals"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-luxury-gold-700 hover:text-luxury-gold-800 transition-colors"
          >
            <span>View All New Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 4. Trending Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-luxury-gold-700 font-bold mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Connoisseur Favorites</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Trending Now
            </h2>
          </div>

          <Link
            to="/trending"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-luxury-gold-700 hover:text-luxury-gold-800 transition-colors"
          >
            <span>Explore All Trending</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 5. Brand Story Section */}
      <section className="bg-luxury-cream-100/60 py-16 sm:py-24 border-y border-neutral-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <img
            src={logoImg}
            alt="L-KUSH Couture"
            className="h-16 w-auto mx-auto object-contain"
          />

          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block">
            The Atelier Philosophy
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight leading-snug">
            Artistry in Threads & Tradition
          </h2>

          <div className="w-16 h-0.5 bg-luxury-gold-500 mx-auto" />

          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed max-w-2xl mx-auto">
            At L-KUSH Couture, we envision Indian luxury fashion as an exquisite dialogue between age-old textile heritage and sharp contemporary tailoring. Every sherwani, bandhgala, and festive kurta is crafted to celebrate the monumental occasions of life.
          </p>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            From the depth of micro-velvet to the luminous touch of Varanasi brocade and delicate Lucknowi chikankari, our garments reflect uncompromising devotion to silhouette, texture, and refined elegance.
          </p>

          <div className="pt-4">
            <Link to="/shop">
              <Button variant="outline" size="md">
                Discover The Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Verified Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-2">
            Client Reflections
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Celebrated by Patrons
          </h2>

          <div className="w-12 h-0.5 bg-luxury-gold-500 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 sm:p-8 border border-neutral-200/90 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current"
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-neutral-900">
                    {t.author}
                  </h4>

                  <p className="text-[11px] text-neutral-500">
                    {t.city}
                  </p>
                </div>

                <span className="text-[10px] uppercase tracking-wider font-semibold text-luxury-gold-700 bg-luxury-cream-100 px-2 py-0.5">
                  {t.occasion}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. WhatsApp Direct Concierge Advisory Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-luxury-black via-luxury-charcoal to-luxury-black p-8 sm:p-12 border border-luxury-gold-500/30 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-xs uppercase tracking-widest text-luxury-gold-400 font-bold block">
              Bespoke Fitting & Concierge
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Have Sizing or Customization Questions?
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Connect directly with our master tailoring specialist over WhatsApp to discuss fabric samples, custom measurements, and delivery schedules.
            </p>
          </div>

          <button
            onClick={() =>
              openWhatsAppCustom(
                'Hello L-KUSH Couture, I would like to inquire about bespoke sizing and tailoring details.'
              )
            }
            className="shrink-0 px-6 py-3.5 bg-luxury-gold-500 hover:bg-luxury-gold-400 text-luxury-black font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2 shadow-gold-subtle hover:shadow-gold-glow transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consult on WhatsApp</span>
          </button>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
