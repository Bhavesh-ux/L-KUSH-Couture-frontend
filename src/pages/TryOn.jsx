import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { tryOnService } from '../services/tryOnService';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { formatPrice } from '../utils/formatters';
import {
  Sparkles,
  Upload,
  Camera,
  Check,
  Download,
  BookmarkPlus,
  ShoppingBag,
  RotateCcw,
  Sliders,
  ArrowRight,
  Info
} from 'lucide-react';

export const TryOn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const preselectedProductId = searchParams.get('productId');

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerPhoto, setCustomerPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [fitPreference, setFitPreference] = useState('Imperial Royal Fit');
  
  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Sample portrait models for instant testing
  const samplePortraits = [
    { label: "Model 1 (Groom)", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" },
    { label: "Model 2 (Cocktail)", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" },
    { label: "Model 3 (Festive)", url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80" }
  ];

  useEffect(() => {
    const loadAttires = async () => {
      const all = await productService.getProducts();
      setProducts(all);

      if (preselectedProductId) {
        const found = all.find((p) => p.id === preselectedProductId);
        if (found) setSelectedProduct(found);
      } else if (all.length > 0) {
        setSelectedProduct(all[0]);
      }
    };
    loadAttires();
  }, [preselectedProductId]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomerPhoto(file);
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sampleUrl) => {
    setPhotoPreview(sampleUrl);
    setCustomerPhoto(sampleUrl);
  };

  const handleGenerate = async () => {
    if (!selectedProduct) {
      addToast("Please choose a couture garment from the collection.", "error");
      return;
    }
    if (!photoPreview) {
      addToast("Please upload or select a portrait photo.", "error");
      return;
    }

    setIsGenerating(true);
    setCurrentStep({ percent: 10, message: "Initializing Neural Couture Draper..." });
    setGeneratedResult(null);
    setIsSaved(false);

    try {
      const result = await tryOnService.generateTryOn(
        selectedProduct,
        photoPreview,
        { fit: fitPreference },
        (step) => setCurrentStep(step)
      );

      setGeneratedResult(result);
      addToast("Your bespoke virtual try-on look has been generated!", "success");
    } catch (err) {
      addToast("Simulation failed. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveLook = async () => {
    if (!generatedResult) return;
    await tryOnService.saveLook(generatedResult);
    setIsSaved(true);
    addToast("Look successfully saved to your Lookbook!", "success");
  };

  const handleDownload = () => {
    if (!generatedResult) return;
    const link = document.createElement('a');
    link.href = generatedResult.resultImage;
    link.download = `L-KUSH-Look-${selectedProduct.id}.jpg`;
    link.target = '_blank';
    link.click();
    addToast("Download initiated.", "info");
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, selectedProduct.sizes?.[0] || '40', selectedProduct.colors?.[0]?.name, 1);
    addToast(`Added ${selectedProduct.name} to Cart`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Studio Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold-500/10 border border-luxury-gold-500/30 text-luxury-gold-700 text-xs uppercase tracking-widest font-bold">
          <Sparkles className="w-3.5 h-3.5 text-luxury-gold-600" />
          <span>Atelier Vision Studio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
          AI Virtual Try-On Studio
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Envision how our handcrafted sherwanis, bandhgalas, and festive kurtas drape on your frame with photorealistic garment simulation.
        </p>
      </div>

      {/* Main Studio Interactive Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Console: Attire & Photo Selection (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 1: Select Couture Attire */}
          <div className="bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-luxury-gold-500 text-luxury-black text-xs flex items-center justify-center font-sans font-bold">1</span>
                <span>Select Attire to Try</span>
              </span>
              {selectedProduct && (
                <span className="text-xs font-bold text-luxury-gold-700">
                  {formatPrice(selectedProduct.price)}
                </span>
              )}
            </div>

            {/* Selected Product Card */}
            {selectedProduct && (
              <div className="flex gap-4 p-3 bg-luxury-cream-50 border border-luxury-gold-300/40 items-center">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-16 h-20 object-cover object-top border shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <span className="text-[10px] uppercase font-bold text-luxury-gold-700 tracking-wider">
                    {selectedProduct.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-neutral-900 truncate">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-neutral-500 text-[11px] line-clamp-1 mt-0.5">
                    {selectedProduct.fabric}
                  </p>
                </div>
              </div>
            )}

            {/* Attire Carousel / Switcher */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">
                Or choose another creation:
              </span>
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {products.slice(0, 10).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setGeneratedResult(null);
                    }}
                    className={`w-16 h-22 border shrink-0 overflow-hidden text-left transition-all ${
                      selectedProduct?.id === p.id
                        ? 'border-luxury-gold-500 ring-2 ring-luxury-gold-500'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.images[0]} alt={p.name} className="w-full h-16 object-cover object-top" />
                    <span className="block text-[9px] p-0.5 truncate font-semibold text-neutral-800 bg-white">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Upload or Select Customer Portrait */}
          <div className="bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-luxury-gold-500 text-luxury-black text-xs flex items-center justify-center font-sans font-bold">2</span>
                <span>Your Portrait Photo</span>
              </span>
              {photoPreview && (
                <button
                  onClick={() => {
                    setPhotoPreview('');
                    setCustomerPhoto(null);
                  }}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Clear Photo
                </button>
              )}
            </div>

            {/* Photo Uploader Box */}
            <div className="relative border-2 border-dashed border-neutral-300 hover:border-luxury-gold-500 p-6 text-center transition-colors bg-luxury-cream-50/30">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-luxury-cream-100 flex items-center justify-center text-luxury-gold-600 border border-luxury-gold-300">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                  Drag & Drop or Click to Upload Portrait
                </p>
                <p className="text-[11px] text-neutral-400">
                  Front-facing, well-lit portrait or waist-up photo recommended
                </p>
              </div>
            </div>

            {/* Instant Demo Models Choice */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">
                Or test instantly with patron models:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {samplePortraits.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample.url)}
                    className={`p-1.5 border flex items-center gap-2 text-left transition-all ${
                      photoPreview === sample.url
                        ? 'border-luxury-gold-500 bg-luxury-cream-100 font-bold'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <img src={sample.url} alt={sample.label} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-[10px] text-neutral-800 truncate">{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fit Preference Selector */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2">
                Tailoring Posture & Silhouette Fit:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Imperial Royal Fit', 'Modern Structured', 'Comfort Traditional'].map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setFitPreference(fit)}
                    className={`py-2 px-2 text-[11px] font-semibold border transition-all text-center ${
                      fitPreference === fit
                        ? 'border-luxury-black bg-luxury-black text-white'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <Button
              variant="gold"
              size="lg"
              className="w-full mt-3"
              disabled={isGenerating || !photoPreview || !selectedProduct}
              loading={isGenerating}
              icon={Sparkles}
              onClick={handleGenerate}
            >
              {isGenerating ? "Synthesizing AI Drapery..." : "Generate My Look"}
            </Button>
          </div>
        </div>

        {/* Right Console: Interactive Preview & Render Results (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-sm min-h-[520px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Virtual Fitting Chamber
                </span>
                <span className="text-xs text-neutral-400">
                  {generatedResult ? "Render Ready" : "Awaiting Generation"}
                </span>
              </div>

              {/* Display Area: Loading vs Result vs Idle */}
              <div className="mt-4">
                {isGenerating ? (
                  <div className="aspect-[3/4] bg-luxury-black text-white flex flex-col items-center justify-center p-8 text-center space-y-6 border border-luxury-gold-500/40">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 rounded-full border-2 border-luxury-gold-500/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-luxury-gold-400 border-t-transparent animate-spin" />
                      <div className="absolute inset-3 rounded-full bg-luxury-gold-500/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-luxury-gold-400 animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-2 max-w-xs">
                      <span className="text-xs uppercase tracking-widest text-luxury-gold-400 font-bold">
                        AI Neural Synthesis
                      </span>
                      <p className="text-xs text-neutral-300 font-medium leading-relaxed">
                        {currentStep?.message || "Analyzing posture and fabric drape..."}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full max-w-xs bg-neutral-800 h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-luxury-gold-400 to-luxury-gold-200 h-full transition-all duration-300"
                        style={{ width: `${currentStep?.percent || 20}%` }}
                      />
                    </div>
                  </div>
                ) : generatedResult ? (
                  /* Generated Look Showcase */
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Customer Photo Input preview */}
                      <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden border border-neutral-300">
                        <img
                          src={generatedResult.customerPhoto}
                          alt="Input Portrait"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-luxury-black/80 text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          Original Portrait
                        </div>
                      </div>

                      {/* Photorealistic Result */}
                      <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden border-2 border-luxury-gold-500 shadow-gold-glow">
                        <img
                          src={generatedResult.resultImage}
                          alt="AI Try-On Result"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-luxury-gold-500 text-luxury-black px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Render</span>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-luxury-black/80 text-luxury-gold-300 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          {selectedProduct.category} Fit
                        </div>
                      </div>
                    </div>

                    {/* Technical Specs Chip */}
                    <div className="p-3 bg-luxury-cream-50 border border-luxury-gold-300/40 text-[11px] text-neutral-600 flex justify-between items-center">
                      <span>Neural drape aligned to posture: <strong>{fitPreference}</strong></span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> 2048px Ultra-HD
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Idle Placeholders */
                  <div className="aspect-[3/4] bg-luxury-cream-50/50 border border-neutral-200 flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-luxury-gold-600 shadow-xs">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-neutral-900">
                      Your Lookbook Preview
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                      Select a royal sherwani or festive kurta on the left, upload your portrait, and press "Generate My Look" to simulate your fitting.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Generated Actions Toolbar */}
            {generatedResult && (
              <div className="pt-4 border-t border-neutral-100 space-y-2.5">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="gold"
                    size="md"
                    icon={ShoppingBag}
                    onClick={handleAddToCart}
                  >
                    Add Attire to Cart
                  </Button>

                  <Button
                    variant={isSaved ? "dark" : "outline"}
                    size="md"
                    icon={BookmarkPlus}
                    onClick={handleSaveLook}
                    disabled={isSaved}
                  >
                    {isSaved ? "Saved in Lookbook" : "Save Look"}
                  </Button>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 font-semibold uppercase tracking-wider"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Look</span>
                  </button>

                  <Link
                    to="/saved-looks"
                    className="inline-flex items-center gap-1 text-luxury-gold-700 hover:text-luxury-gold-900 font-bold uppercase tracking-wider"
                  >
                    <span>View Saved Looks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
