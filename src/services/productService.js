import {
  getStorageItem,
} from '../utils/localStorage';

/**
 * Service abstraction for Product Inventory management.
 * Product listing is connected to the backend API.
 */
export const productService = {
  /**
   * Fetch products from backend API with supported filters.
   * @param {Object} filters - Filter criteria
   */
  async getProducts(filters = {}) {
    const params = new URLSearchParams();

    if (filters.category && filters.category !== 'all') {
      params.set('category', filters.category);
    }

    if (filters.search && filters.search.trim()) {
      params.set('search', filters.search.trim());
    }

    if (
      filters.minPrice !== undefined &&
      filters.minPrice !== null
    ) {
      params.set('minPrice', filters.minPrice);
    }

    if (
      filters.maxPrice !== undefined &&
      filters.maxPrice !== null
    ) {
      params.set('maxPrice', filters.maxPrice);
    }

    if (Array.isArray(filters.sizes)) {
  filters.sizes.forEach((size) => {
    if (size) {
      params.append('size', size);
    }
  });
}

if (Array.isArray(filters.colors)) {
  filters.colors.forEach((color) => {
    if (color) {
      params.append('color', color);
    }
  });
}

if (filters.inStockOnly) {
  params.set('inStock', 'true');
}

if (filters.sortBy) {
  params.set('sortBy', filters.sortBy);
}

    const queryString = params.toString();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products${
        queryString ? `?${queryString}` : ''
      }`
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to fetch products'
      );
    }

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error(
        'Invalid products response from server'
      );
    }

    return data.data.map((product) => {
      const price = Number(product.price) || 0;

      const originalPrice =
        product.compare_price !== null &&
        product.compare_price !== undefined
          ? Number(product.compare_price)
          : price;

      const discount =
        originalPrice > price
          ? Math.round(
              ((originalPrice - price) / originalPrice) * 100
            )
          : 0;

      return {
        id: String(product.id),
        name: product.name,

        category:
          product.category_name || 'Uncategorized',

        categoryId: product.category_id
          ? String(product.category_id)
          : null,

        description: product.description || '',

        price,
        originalPrice,
        discount,

        stock: Number(product.stock) || 0,

        images: Array.isArray(product.images)
          ? product.images
          : [],

        featured: Boolean(product.is_featured),

        rating: 0,
        reviewCount: 0,

        sizes: Array.isArray(product.sizes)
          ? product.sizes
          : [],

        colors: Array.isArray(product.colors)
          ? product.colors
          : [],

        newArrival: false,
        trending: false,
        tags: [],
        fabric: '',
        care: '',
        fit: '',
      };
    });
  },

  /**
   * Fetches single product by ID
   * @param {string} id - Product ID
   */
  async getProductById(id) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${id}`
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to fetch product'
      );
    }

    if (!data.success || !data.data) {
      throw new Error(
        data.message || 'Product not found'
      );
    }

    const product = data.data;

    const price = Number(product.price) || 0;

    const originalPrice =
      product.compare_price !== null &&
      product.compare_price !== undefined
        ? Number(product.compare_price)
        : price;

    const discount =
      originalPrice > price
        ? Math.round(
            ((originalPrice - price) / originalPrice) * 100
          )
        : 0;

    return {
      id: String(product.id),
      name: product.name,

      category:
        product.category_name || 'Uncategorized',

      categoryId: product.category_id
        ? String(product.category_id)
        : null,

      description: product.description || '',

      price,
      originalPrice,
      discount,

      stock: Number(product.stock) || 0,

      images: Array.isArray(product.images)
        ? product.images
        : [],

      featured: Boolean(product.is_featured),

      rating: 0,
      reviewCount: 0,

      sizes: Array.isArray(product.sizes)
        ? product.sizes
        : [],

      colors: Array.isArray(product.colors)
        ? product.colors
        : [],

      newArrival: false,
      trending: false,
      tags: [],
      fabric: '',
      care: '',
      fit: '',
    };
  },

  /**
   * Admin / Owner: Create new product
   * @param {Object} productData - New product details
   */
  async createProduct(productData) {
    const token = getStorageItem(
      'lkush_auth_token',
      null
    );

    if (!token) {
      throw new Error(
        'Authentication required. Please login again.'
      );
    }

    const slug =
      productData.slug ||
      productData.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const payload = {
      category_id: productData.categoryId
        ? Number(productData.categoryId)
        : null,

      name: productData.name.trim(),

      slug,

      description:
        productData.description?.trim() || null,

      price: Number(productData.price),

      compare_price:
        productData.originalPrice !== undefined &&
        productData.originalPrice !== null &&
        productData.originalPrice !== ''
          ? Number(productData.originalPrice)
          : null,

      stock: Number(productData.stock) || 0,

      sku: productData.sku?.trim() || null,

      is_featured: Boolean(productData.featured),

      sizes: Array.isArray(productData.sizes)
        ? productData.sizes
        : [],

      colors: Array.isArray(productData.colors)
        ? productData.colors
        : [],
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to create product'
      );
    }

    if (!data.success || !data.data) {
      throw new Error(
        data.message || 'Product creation failed'
      );
    }

    return data.data;
  },

  /**
   * Admin / Owner: Update existing product
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product fields
   */
  async updateProduct(id, productData) {
    const token = getStorageItem(
      'lkush_auth_token',
      null
    );

    if (!token) {
      throw new Error(
        'Authentication required. Please login again.'
      );
    }

    const slug =
      productData.slug ||
      productData.name
        ?.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const payload = {
      category_id: productData.categoryId
        ? Number(productData.categoryId)
        : null,

      name: productData.name?.trim(),

      slug,

      description:
        productData.description?.trim() || null,

      price: Number(productData.price),

      compare_price:
        productData.originalPrice !== undefined &&
        productData.originalPrice !== null &&
        productData.originalPrice !== ''
          ? Number(productData.originalPrice)
          : null,

      stock: Number(productData.stock) || 0,

      sku: productData.sku?.trim() || null,

      is_featured: Boolean(productData.featured),

      sizes: Array.isArray(productData.sizes)
        ? productData.sizes
        : [],

      colors: Array.isArray(productData.colors)
        ? productData.colors
        : [],
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to update product'
      );
    }

    if (!data.success || !data.data) {
      throw new Error(
        data.message || 'Product update failed'
      );
    }

    return data.data;
  },

  /**
   * Admin / Owner: Delete product
   * @param {string} id - Product ID
   */
  async deleteProduct(id) {
    const token = getStorageItem(
      'lkush_auth_token',
      null
    );

    if (!token) {
      throw new Error(
        'Authentication required. Please login again.'
      );
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to delete product'
      );
    }

    if (!data.success) {
      throw new Error(
        data.message || 'Product deletion failed'
      );
    }

    return true;
  },

  /**
   * Admin / Owner: Upload product image
   */
  async uploadProductImage(productId, file) {
    const token = getStorageItem(
      'lkush_auth_token',
      null
    );

    if (!token) {
      throw new Error(
        'Authentication required. Please login again.'
      );
    }

    const formData = new FormData();

    formData.append('images', file);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${productId}/images/upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to upload product image'
      );
    }

    if (!data.success || !data.data) {
      throw new Error(
        data.message || 'Product image upload failed'
      );
    }

    return data.data;
  },

  /**
   * Admin / Owner: Set primary product image
   */
  async setPrimaryProductImage(
    productId,
    imageId
  ) {
    const token = getStorageItem(
      'lkush_auth_token',
      null
    );

    if (!token) {
      throw new Error(
        'Authentication required. Please login again.'
      );
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${productId}/images/${imageId}/primary`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Failed to set primary image'
      );
    }

    if (!data.success) {
      throw new Error(
        data.message ||
          'Failed to set primary image'
      );
    }

    return data.data;
  },

  /**
   * Admin / Owner: Delete product image
   */
  async deleteProductImage(
    productId,
    imageId
  ) {
    const token = getStorageItem(
      'lkush_auth_token',
      null
    );

    if (!token) {
      throw new Error(
        'Authentication required. Please login again.'
      );
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${productId}/images/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Failed to delete product image'
      );
    }

    if (!data.success) {
      throw new Error(
        data.message ||
          'Failed to delete product image'
      );
    }

    return data.data;
  },
};  