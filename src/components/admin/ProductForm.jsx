import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import {
  Upload,
  Trash2,
  ArrowLeft,
} from 'lucide-react';

export const ProductForm = ({
  initialData = null,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Newly selected files.
  // These are uploaded to Cloudinary after product save.
  const [imageFiles, setImageFiles] = useState([]);

  // Backend image IDs.
  // Existing images have IDs.
  // Newly selected local images have null IDs until uploaded.
  const [imageIds, setImageIds] = useState(
    Array.isArray(initialData?.images)
      ? initialData.images.map((image) =>
          typeof image === 'string'
            ? null
            : image?.id || null
        )
      : []
  );

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
  category:
  initialData?.category || '',
    categoryId:
  initialData?.categoryId || '',

    description:
      initialData?.description || '',

    price: initialData?.price || '',

    originalPrice:
      initialData?.originalPrice || '',

    discount:
      initialData?.discount || 0,

    sizes: initialData?.sizes || [
      '38',
      '40',
      '42',
      '44',
    ],

    colors: initialData?.colors || [
      {
        name: 'Midnight Navy',
        hex: '#1A2536',
      },
      {
        name: 'Antique Gold',
        hex: '#C5A059',
      },
    ],

    stock:
      initialData?.stock !== undefined
        ? initialData.stock
        : 12,

    // Convert backend image objects into URLs
    // because the UI expects image strings.
    images: Array.isArray(initialData?.images)
      ? initialData.images
          .map((image) =>
            typeof image === 'string'
              ? image
              : image?.image_url
          )
          .filter(Boolean)
      : [
          'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80',
        ],

    featured:
      initialData?.featured || false,

    newArrival:
      initialData?.newArrival !== undefined
        ? initialData.newArrival
        : true,

    trending:
      initialData?.trending || false,

    status:
      initialData?.status || 'active',

    tags:
      initialData?.tags?.join(', ') ||
      'Sherwani, Wedding, Bespoke',

    fabric:
      initialData?.fabric ||
      'Pure Mulberry Silk with Zari',

    care:
      initialData?.care ||
      'Dry Clean Only',

    fit:
      initialData?.fit ||
      'Tailored Royal Silhouette',
  });

  const availableSizes = [
    '38',
    '40',
    '42',
    '44',
    '46',
  ];

  // --------------------------------
  // LOAD CATEGORIES
  // --------------------------------
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats =
          await categoryService.getCategories();

        setCategories(cats);
      } catch (error) {
        console.error(
          'Failed to load categories:',
          error
        );

        addToast(
          'Failed to load categories.',
          'error'
        );
      }
    };

    loadCategories();
  }, []);

  // --------------------------------
  // AUTO CALCULATE DISCOUNT
  // --------------------------------
  useEffect(() => {
    const price = Number(formData.price);

    const originalPrice =
      Number(formData.originalPrice);

    if (
      price &&
      originalPrice &&
      originalPrice > price
    ) {
      const discount = Math.round(
        ((originalPrice - price) /
          originalPrice) *
          100
      );

      setFormData((prev) => ({
        ...prev,
        discount,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        discount: 0,
      }));
    }
  }, [
    formData.price,
    formData.originalPrice,
  ]);

  // --------------------------------
  // SIZE TOGGLE
  // --------------------------------
  const handleSizeToggle = (size) => {
    const current =
      formData.sizes || [];

    const updated = current.includes(size)
      ? current.filter(
          (item) => item !== size
        )
      : [...current, size];

    setFormData((prev) => ({
      ...prev,
      sizes: updated,
    }));
  };

  // --------------------------------
  // IMAGE UPLOAD / LOCAL PREVIEW
  // --------------------------------
  const handleImageUpload = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    if (
      files.length + imageFiles.length >
      10
    ) {
      addToast(
        'Maximum 10 images are allowed.',
        'error'
      );

      e.target.value = '';
      return;
    }

    const validFiles = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        addToast(
          `${file.name} is not a valid image.`,
          'error'
        );
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        addToast(
          `${file.name} is larger than 5MB.`,
          'error'
        );
        continue;
      }

      const previewUrl =
        URL.createObjectURL(file);

      validFiles.push({
        file,
        previewUrl,
      });
    }

    if (validFiles.length > 0) {
      setImageFiles((prev) => [
        ...prev,
        ...validFiles,
      ]);

      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          ...validFiles.map(
            (item) => item.previewUrl
          ),
        ],
      }));

      // New local images do not have backend IDs yet.
      setImageIds((prev) => [
        ...prev,
        ...validFiles.map(() => null),
      ]);

      addToast(
        `${validFiles.length} image(s) selected.`,
        'success'
      );
    }

    e.target.value = '';
  };

  // --------------------------------
  // REMOVE IMAGE
  // --------------------------------
  const handleRemoveImage = async (index) => {
  if (formData.images.length <= 1) {
    addToast(
      'A garment must have at least one showcase image.',
      'error'
    );
    return;
  }

  const imageId = imageIds[index];
  const removedImage = formData.images[index];

  // New local image
  // Backend mein abhi exist nahi karti.
  if (!imageId) {
    setImageFiles((prev) => {
      const updated = prev.filter(
        (item) =>
          item.previewUrl !== removedImage
      );

      if (
        updated.length !== prev.length &&
        removedImage?.startsWith('blob:')
      ) {
        URL.revokeObjectURL(removedImage);
      }

      return updated;
    });

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, i) => i !== index
      ),
    }));

    setImageIds((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );

    addToast(
      'Selected image removed.',
      'info'
    );

    return;
  }

  // Existing backend image
  try {
    setLoading(true);

    const productId =
      initialData?.id;

    await productService.deleteProductImage(
      productId,
      imageId
    );

    // Remove from local UI after
    // successful backend deletion.
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, i) => i !== index
      ),
    }));

    setImageIds((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );

    addToast(
      'Product image deleted successfully.',
      'success'
    );
  } catch (error) {
    console.error(
      'Failed to delete product image:',
      error
    );

    addToast(
      error.message ||
        'Failed to delete product image.',
      'error'
    );
  } finally {
    setLoading(false);
  }
};

  // --------------------------------
  // SET PRIMARY IMAGE
  // --------------------------------
  const handleSetPrimaryImage = async (
    index
  ) => {
    if (index === 0) {
      return;
    }

    const imageId =
      imageIds[index];

    // --------------------------------
    // NEW LOCAL IMAGE
    // --------------------------------
    // It has no backend ID yet.
    // We can only change its local display order.
    if (!imageId) {
      const updatedImages = [
        ...formData.images,
      ];

      const [selectedImage] =
        updatedImages.splice(index, 1);

      updatedImages.unshift(
        selectedImage
      );

      const updatedIds = [
        ...imageIds,
      ];

      const [selectedId] =
        updatedIds.splice(index, 1);

      updatedIds.unshift(selectedId);

      setFormData((prev) => ({
        ...prev,
        images: updatedImages,
      }));

      setImageIds(updatedIds);

      addToast(
        'Primary showcase photo updated locally. Save the product to upload it.',
        'success'
      );

      return;
    }

    // --------------------------------
    // EXISTING BACKEND IMAGE
    // --------------------------------
    try {
      setLoading(true);

      const productId =
        initialData?.id;

      await productService.setPrimaryProductImage(
        productId,
        imageId
      );

      // Update local display order.
      const updatedImages = [
        ...formData.images,
      ];

      const [selectedImage] =
        updatedImages.splice(index, 1);

      updatedImages.unshift(
        selectedImage
      );

      // Keep backend IDs in same order.
      const updatedIds = [
        ...imageIds,
      ];

      const [selectedId] =
        updatedIds.splice(index, 1);

      updatedIds.unshift(selectedId);

      setFormData((prev) => ({
        ...prev,
        images: updatedImages,
      }));

      setImageIds(updatedIds);

      addToast(
        'Primary showcase photo updated successfully.',
        'success'
      );
    } catch (error) {
      console.error(
        'Failed to set primary image:',
        error
      );

      addToast(
        error.message ||
          'Failed to set primary image.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // SUBMIT PRODUCT
  // --------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      addToast(
        'Garment title is required.',
        'error'
      );
      return;
    }

    if (!formData.description.trim()) {
      addToast(
        'Product description is required.',
        'error'
      );
      return;
    }

    if (
      !formData.price ||
      Number(formData.price) < 0
    ) {
      addToast(
        'Please enter a valid selling price.',
        'error'
      );
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,

      price: Number(formData.price),

      originalPrice:
        Number(formData.originalPrice) ||
        Number(formData.price),

      stock: Number(formData.stock),

      tags:
        typeof formData.tags === 'string'
          ? formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : formData.tags,
    };

    try {
      let product;

      // --------------------------------
      // EDIT PRODUCT
      // --------------------------------
      if (isEdit) {
        product =
          await productService.updateProduct(
            initialData.id,
            payload
          );

        addToast(
          `Updated ${payload.name} successfully.`,
          'success'
        );
      }

      // --------------------------------
      // CREATE PRODUCT
      // --------------------------------
      else {
        product =
          await productService.createProduct(
            payload
          );

        addToast(
          `Created new garment: ${payload.name}.`,
          'success'
        );
      }

      // --------------------------------
      // UPLOAD NEW IMAGES
      // --------------------------------
      if (imageFiles.length > 0) {
        for (const imageItem of imageFiles) {
          await productService.uploadProductImage(
            product.id ||
              initialData.id,
            imageItem.file
          );
        }

        addToast(
          `${imageFiles.length} product image(s) uploaded successfully.`,
          'success'
        );
      }

      // --------------------------------
      // CLEANUP LOCAL PREVIEWS
      // --------------------------------
      imageFiles.forEach(
        (imageItem) => {
          if (
            imageItem.previewUrl?.startsWith(
              'blob:'
            )
          ) {
            URL.revokeObjectURL(
              imageItem.previewUrl
            );
          }
        }
      );

      navigate('/admin/products');
    } catch (error) {
      console.error(
        'Product operation failed:',
        error
      );

      addToast(
        error.message ||
          'Operation failed.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-5xl mx-auto text-xs"
    >
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <button
          type="button"
          onClick={() =>
            navigate('/admin/products')
          }
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" />

          <span>
            Back to Product Directory
          </span>
        </button>

        <Button
          type="submit"
          variant="gold"
          size="md"
          loading={loading}
        >
          {isEdit
            ? 'Save Garment Modifications'
            : 'Publish Garment to Catalog'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT FORM */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/90 p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-base font-bold text-neutral-900 pb-2 border-b border-neutral-100">
            Garment Identity &
            Specifications
          </h3>

          {/* Garment title */}
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Garment Title *
            </label>

            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="e.g. Royal Velvet Zardozi Sherwani"
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 font-serif text-sm"
            />
          </div>

          {/* Category + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Category Collection *
              </label>

             <select
  value={formData.category}
  onChange={(e) => {
    const selectedCategory = categories.find(
      (category) => category.name === e.target.value
    );

    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
      categoryId: selectedCategory
        ? selectedCategory.id
        : '',
    }));
  }}
>
  <option value="" disabled>
    Select Category
  </option>

  {categories.map((category) => (
    <option
      key={category.id}
      value={category.name}
    >
      {category.name}
    </option>
  ))}
</select>
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Stock Quantity *
              </label>

              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stock: e.target.value,
                  }))
                }
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Selling Price (₹) *
              </label>

              <input
                type="number"
                required
                min="1000"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                placeholder="34999"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 font-sans font-bold"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Original Price (₹)
              </label>

              <input
                type="number"
                min="1000"
                value={
                  formData.originalPrice
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    originalPrice:
                      e.target.value,
                  }))
                }
                placeholder="42999"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 font-sans"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Discount (%)
              </label>

              <input
                type="text"
                readOnly
                value={`${formData.discount}%`}
                className="w-full p-2.5 border border-neutral-200 bg-neutral-100 text-neutral-600 font-bold"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Atelier Description &
              Craft Details *
            </label>

            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description:
                    e.target.value,
                }))
              }
              placeholder="Describe craftsmanship, zardozi embroidery, silk weave, and ceremonial suitability..."
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 leading-relaxed"
            />
          </div>

          {/* Fabric + Fit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Fabric Material
              </label>

              <input
                type="text"
                value={formData.fabric}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fabric: e.target.value,
                  }))
                }
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Tailoring Silhouette Fit
              </label>

              <input
                type="text"
                value={formData.fit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fit: e.target.value,
                  }))
                }
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-2">
              Available Chest Sizes
            </label>

            <div className="flex gap-2">
              {availableSizes.map(
                (size) => {
                  const isSelected =
                    formData.sizes.includes(
                      size
                    );

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        handleSizeToggle(
                          size
                        )
                      }
                      className={`w-10 h-10 border font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-luxury-black text-white border-luxury-black'
                          : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Colors */}
<div>
  <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-2">
    Available Colors
  </label>

  <div className="flex flex-wrap gap-2">
    {[
      { name: 'Black', hex: '#0E0E10' },
      { name: 'Navy', hex: '#1A2536' },
      { name: 'Ivory', hex: '#FDFBF7' },
      { name: 'Gold', hex: '#C5A059' },
      { name: 'Maroon', hex: '#4A0E17' },
      { name: 'Green', hex: '#114732' },
    ].map((color) => {
      const isSelected = formData.colors?.some(
        (item) => item.name === color.name
      );

      return (
        <button
          key={color.name}
          type="button"
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              colors: isSelected
                ? prev.colors.filter(
                    (item) => item.name !== color.name
                  )
                : [...(prev.colors || []), color],
            }));
          }}
          className={`flex items-center gap-2 px-3 py-2 border text-xs font-semibold transition-all ${
            isSelected
              ? 'border-luxury-black bg-neutral-100 text-neutral-900'
              : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500'
          }`}
        >
          <span
            className="w-4 h-4 rounded-full border border-neutral-300"
            style={{ backgroundColor: color.hex }}
          />

          <span>{color.name}</span>

          {isSelected && (
            <span className="text-luxury-gold-600">✓</span>
          )}
        </button>
      );
    })}
  </div>
</div>

          {/* Catalog switches */}
          <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  formData.featured
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured:
                      e.target.checked,
                  }))
                }
                className="accent-luxury-gold-500 w-4 h-4"
              />

              <span className="font-semibold text-neutral-800">
                Featured Showcase
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  formData.newArrival
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newArrival:
                      e.target.checked,
                  }))
                }
                className="accent-luxury-gold-500 w-4 h-4"
              />

              <span className="font-semibold text-neutral-800">
                New Arrival Tag
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  formData.trending
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    trending:
                      e.target.checked,
                  }))
                }
                className="accent-luxury-gold-500 w-4 h-4"
              />

              <span className="font-semibold text-neutral-800">
                Trending Favorite
              </span>
            </label>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/90 p-6 shadow-sm space-y-5">
          <div className="pb-2 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-neutral-900">
              Product Photos &
              Angle Management
            </h3>

            <span className="text-[11px] text-luxury-gold-700 font-bold">
              {formData.images.length}{' '}
              Images
            </span>
          </div>

          <p className="text-neutral-500 text-[11px] leading-relaxed">
            Only the owner can manage
            product photos. Upload
            multiple angles and set the
            primary showcase photo.
          </p>

          {/* Upload */}
          <div className="relative border-2 border-dashed border-neutral-300 hover:border-luxury-gold-500 p-5 text-center transition-colors bg-luxury-cream-50/50">
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              onChange={
                handleImageUpload
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div className="flex flex-col items-center space-y-1.5">
              <Upload className="w-6 h-6 text-luxury-gold-600" />

              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                Upload New Image(s)
              </span>

              <span className="text-[10px] text-neutral-400">
                PNG, JPG, or WEBP up to
                5MB
              </span>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] uppercase font-bold text-neutral-500 tracking-wider block">
              Active Garment Photos
              (First is Primary)
            </span>

            <div className="grid grid-cols-2 gap-3">
              {formData.images.map(
                (imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    className={`relative aspect-[3/4] bg-neutral-100 border overflow-hidden group ${
                      index === 0
                        ? 'border-2 border-luxury-gold-500 ring-1 ring-luxury-gold-500'
                        : 'border-neutral-200'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`angle ${
                        index + 1
                      }`}
                      className="w-full h-full object-cover object-top"
                    />

                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-luxury-gold-500 text-luxury-black text-[9px] font-extrabold uppercase px-1.5 py-0.5 tracking-wider shadow-sm">
                        Primary
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/75 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSetPrimaryImage(
                              index
                            )
                          }
                          className="text-[10px] font-bold text-luxury-gold-400 hover:underline uppercase"
                        >
                          Set Primary
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveImage(
                            index
                          )
                        }
                        className="text-rose-400 hover:text-white ml-auto p-1"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};