import {
  getStorageItem,
} from '../utils/localStorage';

/**
 * Service abstraction for Category management.
 *
 * Backend connected:
 * - Get all categories
 * - Get category by ID
 * - Create category
 * - Update category
 * - Delete category
 */
export const categoryService = {

  // -----------------------------------------
  // GET ALL CATEGORIES
  // -----------------------------------------
  async getCategories() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/categories`
    );

    const data =
      await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Failed to fetch categories'
      );
    }

    if (
      !data.success ||
      !Array.isArray(data.data)
    ) {
      throw new Error(
        data.message ||
          'Failed to fetch categories'
      );
    }

    return data.data.map((category) => ({
      ...category,

      id: String(category.id),

      name: category.name,

      slug: category.slug,

      description:
        category.description || '',

      // Backend image_url -> frontend image
      image:
        category.image_url || '',

      itemCount:
        Number(category.item_count) || 0,

      status:
        category.is_active === false
          ? 'inactive'
          : 'active',
    }));
  },


  // -----------------------------------------
  // GET CATEGORY BY ID
  // -----------------------------------------
  async getCategoryById(id) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/categories/${id}`
    );

    const data =
      await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Failed to fetch category'
      );
    }

    if (
      !data.success ||
      !data.data
    ) {
      throw new Error(
        data.message ||
          'Category not found'
      );
    }

    const category = data.data;

    return {
      ...category,

      id: String(category.id),

      name: category.name,

      slug: category.slug,

      description:
        category.description || '',

      // Backend image_url -> frontend image
      image:
        category.image_url || '',

      itemCount:
        Number(category.item_count) || 0,

      status:
        category.is_active === false
          ? 'inactive'
          : 'active',
    };
  },


  // -----------------------------------------
  // CREATE CATEGORY
  // -----------------------------------------
  async createCategory(data) {
    const token = getStorageItem(
      'lkush_auth_token',
      null
    );

    if (!token) {
      throw new Error(
        'Authentication required. Please login again.'
      );
    }

    const name =
      data.name?.trim();

    const slug =
      data.slug?.trim() ||
      name
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (!name) {
      throw new Error(
        'Category name is required.'
      );
    }

    if (!slug) {
      throw new Error(
        'Category slug is required.'
      );
    }

    const payload = {
      name,
      slug,

      description:
        data.description?.trim() ||
        null,

      // AdminCategories uses "image"
      // Backend expects "image_url"
      image_url:
        data.image?.trim() ||
        data.image_url?.trim() ||
        null,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/categories`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      }
    );

    const result =
      await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message ||
          'Failed to create category'
      );
    }

    if (
      !result.success ||
      !result.data
    ) {
      throw new Error(
        result.message ||
          'Category creation failed'
      );
    }

    return {
      ...result.data,

      id: String(
        result.data.id
      ),

      image:
        result.data.image_url || '',

      itemCount:
        Number(
          result.data.item_count
        ) || 0,

      status:
        result.data.is_active === false
          ? 'inactive'
          : 'active',
    };
  },


  // -----------------------------------------
  // UPDATE CATEGORY
  // -----------------------------------------
 async updateCategory(id, data) {
  const token = getStorageItem(
    'lkush_auth_token',
    null
  );

  if (!token) {
    throw new Error(
      'Authentication required. Please login again.'
    );
  }

  // Status-only update
  if (
    data.status === 'active' ||
    data.status === 'inactive'
  ) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/categories/${id}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          status: data.status,
        }),
      }
    );

    const result =
      await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message ||
          'Failed to update category status'
      );
    }

    if (
      !result.success ||
      !result.data
    ) {
      throw new Error(
        result.message ||
          'Category status update failed'
      );
    }

    return {
      ...result.data,

      id: String(
        result.data.id
      ),

      image:
        result.data.image_url || '',

      itemCount:
        Number(
          result.data.item_count
        ) || 0,

      status:
        result.data.is_active === false
          ? 'inactive'
          : 'active',
    };
  }

  // Normal category update
  const name =
    data.name?.trim();

  const slug =
    data.slug?.trim() ||
    name
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  if (!name) {
    throw new Error(
      'Category name is required.'
    );
  }

  if (!slug) {
    throw new Error(
      'Category slug is required.'
    );
  }

  const payload = {
    name,
    slug,

    description:
      data.description?.trim() ||
      null,

    image_url:
      data.image?.trim() ||
      data.image_url?.trim() ||
      null,
  };

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/categories/${id}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(payload),
    }
  );

  const result =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message ||
        'Failed to update category'
    );
  }

  if (
    !result.success ||
    !result.data
  ) {
    throw new Error(
      result.message ||
        'Category update failed'
    );
  }

  return {
    ...result.data,

    id: String(
      result.data.id
    ),

    image:
      result.data.image_url || '',

    itemCount:
      Number(
        result.data.item_count
      ) || 0,

    status:
      result.data.is_active === false
        ? 'inactive'
        : 'active',
  };
},

async uploadCategoryImage(categoryId, file) {
  const token = getStorageItem(
    'lkush_auth_token',
    null
  );

  if (!token) {
    throw new Error(
      'Authentication required. Please login again.'
    );
  }

  if (!file) {
    throw new Error(
      'Category image file is required.'
    );
  }

  const formData = new FormData();

  formData.append(
    'image',
    file
  );

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/categories/${categoryId}/image`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message ||
        'Failed to upload category image'
    );
  }

  if (
    !result.success ||
    !result.data
  ) {
    throw new Error(
      result.message ||
        'Category image upload failed'
    );
  }

  return {
    ...result.data,

    id: String(
      result.data.id
    ),

    image:
      result.data.image_url || '',

    itemCount:
      Number(
        result.data.item_count
      ) || 0,

    status:
      result.data.is_active === false
        ? 'inactive'
        : 'active',
  };
},


  // -----------------------------------------
  // DELETE CATEGORY
  // -----------------------------------------
  async deleteCategory(id) {
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
      `${import.meta.env.VITE_API_URL}/categories/${id}`,
      {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result =
      await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message ||
          'Failed to delete category'
      );
    }

    if (!result.success) {
      throw new Error(
        result.message ||
          'Category deletion failed'
      );
    }

    return true;
  },
};