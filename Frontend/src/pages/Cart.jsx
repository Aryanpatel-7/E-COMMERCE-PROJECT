import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [clearing, setClearing] = useState(false);

  const fetchCart = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data.cart);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch cart."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingProduct(productId);

      const token = localStorage.getItem("token");

      const response = await API.put(
        "/cart/update",
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(response.data.cart);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update quantity."
      );
    } finally {
      setUpdatingProduct(null);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      setUpdatingProduct(productId);

      const token = localStorage.getItem("token");

      const response = await API.delete(
        `/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(response.data.cart);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to remove item."
      );
    } finally {
      setUpdatingProduct(null);
    }
  };

  // Clear cart
  const clearCart = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmClear) {
      return;
    }

    try {
      setClearing(true);

      const token = localStorage.getItem("token");

      const response = await API.delete("/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data.cart);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to clear cart."
      );
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading cart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>

        <button
          onClick={fetchCart}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const items = cart?.items || [];

  const totalItems = items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const totalAmount = items.reduce((total, item) => {
    const price = Number(item.product?.price || 0);
    const quantity = Number(item.quantity || 0);

    return total + price * quantity;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          My Cart
        </h1>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            disabled={clearing}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-60"
          >
            {clearing ? "Clearing..." : "Clear Cart"}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl">🛒</div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-5">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mt-2">
            Add some products to your cart.
          </p>

          <Link
            to="/products"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const productId = item.product?._id;

              const price = Number(
                item.product?.price || 0
              );

              const quantity = Number(
                item.quantity || 0
              );

              const itemTotal = price * quantity;

              const isUpdating =
                updatingProduct === productId;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md p-5"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Image */}
                    <img
                      src={
                        item.product?.image ||
                        "https://placehold.co/200x150?text=Product"
                      }
                      alt={
                        item.product?.name ||
                        "Product"
                      }
                      className="w-full sm:w-40 h-32 object-contain rounded-lg"
                    />

                    {/* Product Info */}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {item.product?.name ||
                          "Product"}
                      </h2>

                      <p className="text-blue-600 font-bold text-lg mt-2">
                        ₹
                        {price.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <span className="font-medium text-gray-700">
                          Quantity:
                        </span>

                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            quantity <= 1
                          }
                          onClick={() =>
                            updateQuantity(
                              productId,
                              quantity - 1
                            )
                          }
                          className="w-9 h-9 bg-gray-200 rounded-lg font-bold text-lg hover:bg-gray-300 disabled:opacity-40"
                        >
                          -
                        </button>

                        <span className="w-8 text-center font-semibold">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateQuantity(
                              productId,
                              quantity + 1
                            )
                          }
                          className="w-9 h-9 bg-gray-200 rounded-lg font-bold text-lg hover:bg-gray-300 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className="font-semibold text-gray-800 mt-4">
                        Item Total: ₹
                        {itemTotal.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      {/* Remove */}
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          removeItem(productId)
                        }
                        className="mt-4 text-red-600 font-medium hover:text-red-800 disabled:opacity-50"
                      >
                        {isUpdating
                          ? "Updating..."
                          : "Remove Item"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-2xl font-bold text-gray-800">
              Cart Summary
            </h2>

            <div className="flex justify-between mt-6 text-gray-600">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="border-t mt-5 pt-5 flex justify-between">
              <span className="text-lg font-semibold">
                Total Amount
              </span>

              <span className="text-xl font-bold text-blue-600">
                ₹
                {totalAmount.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <button
              type="button"
              disabled
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg opacity-60 cursor-not-allowed"
            >
              Proceed to Checkout (Coming Soon)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;