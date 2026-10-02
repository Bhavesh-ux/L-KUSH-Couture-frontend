import React from 'react';
import { ProductForm } from '../../components/admin/ProductForm';

export const AdminAddProduct = () => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
          Catalog Creation
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Add New Haute Couture Garment
        </h1>
      </div>

      <ProductForm isEdit={false} />
    </div>
  );
};
