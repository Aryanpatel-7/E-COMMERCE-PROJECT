import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch product details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
        <Link
          to="/products"
          className="inline-block mt-4 text-blue-600 underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        Product not found.
        <Link
          to="/products"
          className="block mt-4 text-blue-600 underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link
        to="/products"
        className="text-blue-600 hover:underline"
      >
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
        {/* Product Image */}
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center">
          <img
            src={
              product.image ||
              "https://placehold.co/500x400?text=Product"
            }
            alt={product.name}
            className="w-full h-80 object-contain"
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {product.name}
          </h1>

          <p className="text-2xl font-bold text-blue-600 mt-4">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          {/* Description */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">
              Description:
            </h3>

            <p className="text-gray-600 mt-1 leading-7">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Category */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800">
              Category:
            </h3>

            <p className="text-gray-600 mt-1">
              {typeof product.category === "object"
                ? product.category?.name || "Category unavailable"
                : product.category || "Category unavailable"}
            </p>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            disabled
            className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg opacity-60 cursor-not-allowed"
          >
            Add to Cart (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;