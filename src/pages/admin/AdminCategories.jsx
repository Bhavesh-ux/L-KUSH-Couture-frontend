
import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active'
  });
  const [categoryImageFile, setCategoryImageFile] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);

    setFormData({
      name: '',
      description: '',
      image:
        'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80',
      status: 'active'
    });

    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);

    setFormData({
      name: cat.name,
      description: cat.description,
      image: cat.image,
      status: cat.status || 'active'
    });

    setModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) return;

  try {
    let savedCategory;

    if (editingCategory) {
      savedCategory =
        await categoryService.updateCategory(
          editingCategory.id,
          formData
        );

      if (categoryImageFile) {
        savedCategory =
          await categoryService.uploadCategoryImage(
            editingCategory.id,
            categoryImageFile
          );
      }

      addToast(
        `Updated category "${formData.name}"`,
        'success'
      );
    } else {
      savedCategory =
        await categoryService.createCategory(
          formData
        );

      if (categoryImageFile) {
        savedCategory =
          await categoryService.uploadCategoryImage(
            savedCategory.id,
            categoryImageFile
          );
      }

      addToast(
        `Created new category "${formData.name}"`,
        'success'
      );
    }

    setCategoryImageFile(null);
    setModalOpen(false);
    fetchCategories();
  } catch (err) {
    addToast(
      err.message || 'Operation failed',
      'error'
    );
  }
};

  const handleDeleteCategory = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete category "${name}"?`
      )
    ) {
      try {
        await categoryService.deleteCategory(id);

        addToast(
          `Deleted category "${name}"`,
          'info'
        );

        fetchCategories();
      } catch (err) {
        addToast(
          err.message || 'Failed to delete category',
          'error'
        );
      }
    }
  };

  const handleToggleStatus = async (cat) => {
    const newStatus =
      cat.status === 'active'
        ? 'inactive'
        : 'active';

    try {
      await categoryService.updateCategory(
        cat.id,
        { status: newStatus }
      );

      addToast(
        `Category status set to ${newStatus}`,
        'success'
      );

      fetchCategories();
    } catch (err) {
      addToast(
        err.message || 'Failed to update category status',
        'error'
      );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-luxury-gold-700 font-bold block mb-1">
            Collection Taxonomy
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Categories Manager ({categories.length})
          </h1>
        </div>

        <Button
          variant="gold"
          size="md"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Add New Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              window.location.href =
                `/admin/products?category=${cat.id}`;
            }}
            className="bg-white border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
          >
            {/* Image Preview */}
            <div className="relative aspect-[16/9] bg-neutral-900 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(cat);
                  }}
                  className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    cat.status === 'active'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {cat.status || 'Active'}
                </button>
              </div>

              <span className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[10px] px-2 py-0.5 font-bold uppercase">
                {cat.itemCount || 0} Attires
              </span>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-neutral-900">
                  {cat.name}
                </h3>

                <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">
                  /{cat.slug || cat.id}
                </span>

                <div className="flex items-center gap-2">
                  {/* Edit */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(cat);
                    }}
                    className="p-1.5 text-neutral-600 hover:text-luxury-gold-700 transition-colors"
                    title="Edit category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(
                        cat.id,
                        cat.name
                      );
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingCategory
            ? `Edit Category: ${editingCategory.name}`
            : 'Add New Category Collection'
        }
      >
        <form
          onSubmit={handleSaveCategory}
          className="space-y-4 text-xs"
        >
          {/* Category Name */}
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Category Name *
            </label>

            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
              placeholder="e.g. Achkans & Bandhgalas"
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Description *
            </label>

            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
              placeholder="Brief description of this silhouette collection..."
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500"
            />
          </div>

         {/* Category Image Upload */}
<div>
  <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
    Upload Category Image
  </label>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={(e) =>
      setCategoryImageFile(
        e.target.files?.[0] || null
      )
    }
    className="w-full p-2.5 border border-neutral-300 bg-white focus:outline-none focus:border-luxury-gold-500"
  />

  {categoryImageFile && (
    <p className="mt-1 text-[11px] text-neutral-500">
      Selected: {categoryImageFile.name}
    </p>
  )}
</div>
          

          {/* Status */}
          <div>
            <label className="block uppercase tracking-wider font-semibold text-neutral-700 mb-1">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value
                })
              }
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-luxury-gold-500 bg-white"
            >
              <option value="active">
                Active (Visible in Store)
              </option>

              <option value="inactive">
                Inactive (Hidden)
              </option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="gold"
              size="md"
            >
              {editingCategory
                ? 'Save Modifications'
                : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};