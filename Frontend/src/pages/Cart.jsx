import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const totalAmount = items.reduce((total, item) => {
    const price = Number(item.product?.price || 0);
    const quantity = Number(item.quantity || 0);

    return total + price * quantity;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800">
        My Cart
      </h1>

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
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row gap-5"
              >
                <img
                  src={
                    item.product?.image ||
                    "https://placehold.co/200x150?text=Product"
                  }
                  alt={item.product?.name || "Product"}
                  className="w-full sm:w-40 h-32 object-contain rounded-lg"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.product?.name || "Product"}
                  </h2>

                  <p className="text-blue-600 font-bold text-lg mt-2">
                    ₹
                    {Number(
                      item.product?.price || 0
                    ).toLocaleString("en-IN")}
                  </p>

                  <p className="text-gray-600 mt-2">
                    Quantity: {item.quantity}
                  </p>

                  <p className="font-semibold text-gray-800 mt-2">
                    Item Total: ₹
                    {(
                      Number(item.product?.price || 0) *
                      Number(item.quantity || 0)
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-2xl font-bold text-gray-800">
              Cart Summary
            </h2>

            <div className="flex justify-between mt-6 text-gray-600">
              <span>Total Items</span>
              <span>{items.length}</span>
            </div>

            <div className="border-t mt-5 pt-5 flex justify-between">
              <span className="text-lg font-semibold">
                Total Amount
              </span>

              <span className="text-xl font-bold text-blue-600">
                ₹{totalAmount.toLocaleString("en-IN")}
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