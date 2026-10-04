import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/products/${id}`);

        setProduct(response.data.product);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setCartMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setCartMessage("Please login first.");
        return;
      }

      const response = await API.post(
        "/cart/add",
        {
          productId: product._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartMessage(
        response.data.message || "Product added to cart successfully!"
      );
    } catch (err) {
      setCartMessage(
        err.response?.data?.message ||
          "Failed to add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>

        <Link
          to="/products"
          className="inline-block mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
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
        <div className="bg-white rounded-xl shadow-md p-6">
          <img
            src={
              product.image ||
              "https://placehold.co/600x500?text=Product"
            }
            alt={product.name}
            className="w-full h-[450px] object-contain rounded-lg"
          />
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {product.name}
          </h1>

          <p className="text-2xl font-bold text-blue-600 mt-5">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
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

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              Quantity:
            </h3>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
                className="w-10 h-10 bg-gray-200 rounded-lg text-xl font-bold hover:bg-gray-300"
              >
                -
              </button>

              <span className="text-xl font-semibold w-10 text-center">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((prev) => prev + 1)
                }
                className="w-10 h-10 bg-gray-200 rounded-lg text-xl font-bold hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Add To Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {addingToCart ? "Adding..." : "Add to Cart"}
          </button>

          {/* Message */}
          {cartMessage && (
            <p
              className={`mt-4 text-center font-medium ${
                cartMessage.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {cartMessage}
            </p>
          )}

          {/* Go To Cart */}
          <Link
            to="/cart"
            className="block text-center mt-4 border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50"
          >
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;