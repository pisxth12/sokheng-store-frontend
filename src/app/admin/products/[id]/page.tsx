"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Tag,
  Calendar,
  Star,
  Image as ImageIcon,
  Package,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/admin/product.type";
import toast from "react-hot-toast";
import { adminProductApi } from "@/lib/admin/product";
import ProductForm from "@/components/admin/products/ProductForm";
import { useProducts } from "@/hooks/admin/useProduct";

export default function AdminProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { clearDicountPrice , 
    updateProduct,
    toggleMainImage,
    deleteImage,
    saving,  
    refresh,} = useProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await adminProductApi.getById(parseInt(id));
      setProduct(data);
      setSelectedImage(data.mainImage || undefined);
    } catch (err: any) {
      setError(err.message || "Failed to load product");
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminProductApi.delete(parseInt(id));
      toast.success("Product deleted successfully");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleStatus = async () => {
    try {
      await adminProductApi.toggleStatus(parseInt(id));
      await fetchProduct();
      toast.success(
        `Product ${product?.isActive ? "deactivated" : "activated"}`,
      );
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  const handleToggleFeatured = async () => {
    try {
      await adminProductApi.toggleFeatured(parseInt(id));
      await fetchProduct();
      toast.success(
        `Product ${product?.isFeatured ? "removed from" : "added to"} featured`,
      );
    } catch (err: any) {
      toast.error("Failed to update featured status");
    }
  };

  // ─── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-40 bg-gray-100 rounded-lg" />
          <div className="h-8 w-64 bg-gray-100 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl" />
              <div className="h-28 bg-gray-100 rounded-2xl" />
            </div>
            <div className="space-y-4">
              <div className="h-44 bg-gray-100 rounded-2xl" />
              <div className="h-32 bg-gray-100 rounded-2xl" />
              <div className="h-24 bg-gray-100 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <div className="flex flex-col items-center justify-center py-20 border border-red-100 bg-red-50 rounded-2xl text-center">
          <Package className="w-10 h-10 text-red-300 mb-3" />
          <p className="text-sm text-red-500 font-medium">
            {error || "Product not found"}
          </p>
        </div>
      </div>
    );
  }

  const stockPercent =
    product.stock != null && product.soldCount != null
      ? Math.round((product.stock / (product.stock + product.soldCount)) * 100)
      : null;

  // ─── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link
          href="/admin/products"
          className="hover:text-gray-700 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </div>

      {/* ── Header ── */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
            {product.name}
          </h1>
          <div className="flex gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.isActive
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-red-50 text-red-600 ring-1 ring-red-200"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                Featured 
              </span>
            )}
            {product.isOnSale && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200">
                On Sale
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handleToggleFeatured}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {product.isFeatured ? <Star className="w-3.5 h-3.5 text-yellow-400 stroke-amber-400" /> : <Star className="w-3.5 h-3.5" />}
            {product.isFeatured ? "Unfeature" : "Feature"}
          </button>

          <button
            onClick={handleToggleStatus}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              product.isActive
                ? "text-red-600 border-red-200 bg-white hover:bg-red-50"
                : "text-emerald-600 border-emerald-200 bg-white hover:bg-emerald-50"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {product.isActive ? "Deactivate" : "Activate"}
          </button>

          <button
            onClick={() => setOpenEditModal(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column: Images + Description ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image viewer */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-white">
            <div className="relative aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden mb-4">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-10 h-10 text-gray-300" />
                  <span className="text-xs text-gray-400">No image</span>
                </div>
              )}
              {/* Discount badge overlay */}
              {product.discountPercent && (
                <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-600 ring-1 ring-red-200 rounded-full">
                  −{product.discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.imageUrl)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImage === img.imageUrl
                        ? "border-gray-900 ring-2 ring-gray-900/10"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.altText || `Image ${img.id}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="border border-gray-100 rounded-2xl p-6 bg-white">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {product.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* ── Right column: Metadata cards ── */}
        <div className="space-y-5">
          {/* Pricing */}
          <div className="border border-gray-100 rounded-2xl p-6 bg-white">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Pricing
            </h2>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ${product.salePrice ?? product.price}
              </span>
              {product.salePrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.price}
                </span>
              )}
            </div>

            <div className="space-y-2.5 border-t border-gray-100 pt-4">
              <Row label="Original price" value={`$${product.price}`} />
              {product.salePrice && (
                <Row
                  label="Sale price"
                  value={`$${product.salePrice}`}
                  valueClass="text-emerald-600"
                />
              )}
              {product.price && product.salePrice && (
                <Row label="Current price" value={`$${product.price}`} />
              )}
              {product.discountPercent && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Discount</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
                    −{product.discountPercent}%
                  </span>
                </div>
              )}
              {product.saleEndDate && (
                <Row
                  label="Sale ends"
                  value={new Date(product.saleEndDate).toLocaleDateString()}
                  valueClass="text-amber-600"
                />
              )}
            </div>
          </div>

          {/* Inventory */}
          <div className="border border-gray-100 rounded-2xl p-6 bg-white">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Inventory
            </h2>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">SKU</span>
                <span className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-0.5 rounded">
                  {product.sku}
                </span>
              </div>
              {product.slug && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Slug</span>
                  <span className="text-xs font-mono text-gray-500 truncate max-w-[140px]">
                    {product.slug}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Stock</span>
                <span
                  className={`text-xs font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}
                >
                  {product.stock} units
                </span>
              </div>
              {product.soldCount != null && (
                <Row label="Sold" value={`${product.soldCount} units`} />
              )}

              {/* Stock bar */}
              {stockPercent !== null && (
                <div className="pt-1">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] text-gray-400">
                      Stock level
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {stockPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category & Brand side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-2xl p-4 bg-white">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Category
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">
                    {product.categoryName}
                  </p>
                  {product.categorySlug && (
                    <p className="text-[10px] font-mono text-gray-400 truncate">
                      {product.categorySlug}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl p-4 bg-white">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Brand
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-sky-600">
                  {product.brandName?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">
                    {product.brandName}
                  </p>
                  {product.brandSlug && (
                    <p className="text-[10px] font-mono text-gray-400 truncate">
                      {product.brandSlug}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border border-gray-100 rounded-2xl p-5 bg-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs">Created</span>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-xs">Last updated</span>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {product.updatedAt
                    ? new Date(product.updatedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {openEditModal && (
        <ProductForm
          product={product}
          isSaving={saving}
          onToggleMainImage={toggleMainImage}
          onDeleteImage={deleteImage}
          onCreateProduct={async (data) => {}}
          onUpdateProduct={updateProduct}
          onSuccess={() => {
            fetchProduct();
            setOpenEditModal(false);
          }}
          onClose={() => setOpenEditModal(false)}
          clearDiscount={clearDicountPrice}
        />
      )}
    </div>
  );
}

function Row({
  label,
  value,
  valueClass = "text-gray-700",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-xs font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
