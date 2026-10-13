
import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";

const emptyForm = {
  name: "",
  price: "",
  description: "",
  category: "",
  stock: "0",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImage, setExistingImage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // Fetch products and categories
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [productResponse, categoryResponse] = await Promise.all([
        API.get("/products", { headers: getHeaders() }),
        API.get("/categories", { headers: getHeaders() }),
      ]);

      setProducts(productResponse.data.products || []);
      setCategories(categoryResponse.data.categories || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load products or categories."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create image preview
  useEffect(() => {
    if (!selectedImage) {
      setImagePreview("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  // Handle text fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Select image from computer
  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    setError("");
    setMessage("");

    if (file && !file.type.startsWith("image/")) {
      setSelectedImage(null);
      event.target.value = "";
      setError("Please select a valid image file.");
      return;
    }

    setSelectedImage(file);
  };

  // Reset form
  const resetForm = () => {
    setForm({ ...emptyForm });
    setSelectedImage(null);
    setExistingImage("");
    setEditingId(null);
  };

  // Add or update product
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        category: form.category,
        stock: Number(form.stock),
      };

      if (
        !payload.name ||
        !payload.description ||
        !payload.category ||
        !Number.isFinite(payload.price) ||
        payload.price <= 0 ||
        !Number.isInteger(payload.stock) ||
        payload.stock < 0
      ) {
        setError(
          "Enter valid product details, a price above 0, and stock of 0 or more."
        );
        return;
      }

      if (!editingId && !selectedImage) {
        setError("Please select a product image.");
        return;
      }

      if (selectedImage) {
        // Send product details and image as multipart FormData
        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
          formData.append(key, String(value));
        });

        formData.append("image", selectedImage);

        if (editingId) {
          await API.put(`/products/${editingId}`, formData, {
            headers: getHeaders(),
          });
        } else {
          await API.post("/products", formData, {
            headers: getHeaders(),
          });
        }
      } else if (editingId) {
        // Update without changing the existing image
        await API.put(`/products/${editingId}`, payload, {
          headers: getHeaders(),
        });
      }

      const successMessage = editingId
        ? "Product updated successfully."
        : "Product added successfully.";

      resetForm();
      await fetchData();
      setMessage(successMessage);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save product. Check the backend logs."
      );
    } finally {
      setSaving(false);
    }
  };

  // Load product details into form for editing
  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      price: String(product.price ?? ""),
      description: product.description || "",
      category:
        typeof product.category === "object"
          ? product.category?._id || ""
          : product.category || "",
      stock: String(product.stock ?? 0),
    });

    setSelectedImage(null);
    setExistingImage(product.image || "");
    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete product
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await API.delete(`/products/${productId}`, {
        headers: getHeaders(),
      });

      if (editingId === productId) {
        resetForm();
      }

      await fetchData();
      setMessage("Product deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete product."
      );
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading products...</p>;
  }

  const shownImage = imagePreview || existingImage;

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        Admin Product Management
      </h1>

      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p className="mb-4 rounded bg-green-100 p-3 text-green-700">
          {message}
        </p>
      )}

      {/* Add / Edit Product Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4 rounded-lg border p-4 sm:p-6"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div>
          <label htmlFor="name" className="mb-1 block font-medium">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded border p-2"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block font-medium">
            Price (₹)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full rounded border p-2"
            placeholder="Enter price"
          />
        </div>

        <div>
          <label htmlFor="stock" className="mb-1 block font-medium">
            Stock Quantity
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            required
            className="w-full rounded border p-2"
            placeholder="Enter stock quantity"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full rounded border p-2"
            placeholder="Enter product description"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1 block font-medium"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full rounded border p-2"
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Choose image file instead of pasting Cloudinary URL */}
        <div>
          <label htmlFor="image" className="mb-1 block font-medium">
            Product Image{" "}
            {editingId ? "(optional when editing)" : ""}
          </label>

          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!editingId}
            className="w-full rounded border p-2"
          />

          <p className="mt-1 text-sm text-gray-500">
            Select an image from your computer. It will be uploaded
            to Cloudinary when you save the product.
          </p>
        </div>

        {shownImage && (
          <div>
            <p className="mb-2 text-sm font-medium">
              {imagePreview
                ? "Selected image preview"
                : "Current product image"}
            </p>

            <img
              src={shownImage}
              alt="Product preview"
              className="h-40 w-40 rounded border object-contain"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Product"
                : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded border px-5 py-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">
          All Products ({products.length})
        </h2>

        <button
          type="button"
          onClick={fetchData}
          className="rounded border px-4 py-2 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {products.length === 0 ? (
        <p className="rounded border p-5">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product._id}
              className="overflow-hidden rounded-lg border p-4 shadow-sm"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="mb-3 h-44 w-full rounded object-contain"
                />
              )}

              <h3 className="text-lg font-semibold">
                {product.name}
              </h3>

              <p className="mt-1 font-medium">
                ₹{product.price}
              </p>

              <p className="mt-1 text-sm">
                Stock: {product.stock ?? 0}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {product.description}
              </p>

              <p className="mt-2 text-sm">
                <strong>Category:</strong>{" "}
                {typeof product.category === "object"
                  ? product.category?.name || "Category unavailable"
                  : categories.find(
                      (category) =>
                        category._id === product.category
                    )?.name || "Category unavailable"}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleEdit(product)}
                  className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(product._id)}
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminProducts;
