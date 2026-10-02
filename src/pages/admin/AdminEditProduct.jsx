import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductForm } from '../../components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';

export const AdminEditProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center text-luxury-gold-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="font-serif text-xl font-bold text-neutral-900 mb-2">Garment Not Found</h2>
        <Link to="/admin/products" className="text-xs font-bold uppercase text-luxury-gold-700">
          Return to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
          Catalog Refinement • Ref {product.id}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Modify: {product.name}
        </h1>
      </div>

      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
};
