
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const initialAddress = {
  fullname: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await API.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCart(response.data.cart);
      } catch (err) {
        setError(
          err.response?.data?.message || "Cart load nahi ho paya."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate, token]);

  const items = cart?.items || [];

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.product?.price || 0) * item.quantity;
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setShippingAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const products = items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const response = await API.post(
        "/orders",
        {
          products,
          totalPrice,
          shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Order place nahi hua."
        );
      }

      setPlacedOrder(response.data.order);

      // Order successful hone ke baad cart clear karo.
      try {
        await API.delete("/cart/clear", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart({ items: [] });
      } catch (clearError) {
        console.error("Cart clear error:", clearError);
        setError(
          "Order place ho gaya, lekin cart clear nahi hua. Cart page par jaakar check karo."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Order place karte waqt error aaya."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading checkout...</div>;
  }

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center">
        <h1 className="mb-4 text-3xl font-bold text-green-600">
          Order Placed Successfully!
        </h1>

        <p className="mb-2">
          Your order has been created successfully.
        </p>

        <p className="mb-2 break-all">
          <strong>Order ID:</strong> {placedOrder._id}
        </p>

        <p className="mb-6">
          <strong>Total:</strong> ₹
          {Number(placedOrder.totalAmount).toLocaleString("en-IN")}
        </p>

        <Link
          to="/my-orders"
          className="mr-3 inline-block rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          View My Orders
        </Link>

        <Link
          to="/products"
          className="inline-block rounded bg-gray-800 px-5 py-3 text-white hover:bg-gray-900"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <Link
          to="/products"
          className="rounded bg-blue-600 px-5 py-3 text-white"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      {error && (
        <div className="mb-5 rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <form
          onSubmit={handlePlaceOrder}
          className="space-y-4 rounded-lg border p-5 shadow-sm"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Shipping Address
          </h2>

          <input
            name="fullname"
            value={shippingAddress.fullname}
            onChange={handleChange}
            placeholder="Full Name"
            autoComplete="name"
            required
            className="w-full rounded border p-3"
          />

          <input
            name="phone"
            type="tel"
            value={shippingAddress.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            autoComplete="tel"
            pattern="[0-9]{10}"
            title="Enter a 10-digit phone number"
            required
            className="w-full rounded border p-3"
          />

          <textarea
            name="address"
            value={shippingAddress.address}
            onChange={handleChange}
            placeholder="House No., Street, Area"
            autoComplete="street-address"
            required
            rows={3}
            className="w-full rounded border p-3"
          />

          <input
            name="city"
            value={shippingAddress.city}
            onChange={handleChange}
            placeholder="City"
            autoComplete="address-level2"
            required
            className="w-full rounded border p-3"
          />

          <input
            name="state"
            value={shippingAddress.state}
            onChange={handleChange}
            placeholder="State"
            autoComplete="address-level1"
            required
            className="w-full rounded border p-3"
          />

          <input
            name="pincode"
            type="text"
            value={shippingAddress.pincode}
            onChange={handleChange}
            placeholder="PIN Code"
            autoComplete="postal-code"
            pattern="[0-9]{6}"
            title="Enter a 6-digit PIN code"
            required
            className="w-full rounded border p-3"
          />

          <button
            type="submit"
            disabled={placingOrder}
            className="w-full rounded bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="h-fit rounded-lg border p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product?._id}
                className="flex justify-between gap-4 border-b pb-3"
              >
                <div>
                  <p className="font-medium">
                    {item.product?.name || "Product"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-medium">
                  ₹
                  {(
                    Number(item.product?.price || 0) * item.quantity
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Payment integration is not enabled yet. This step creates a
            Pending order; it does not collect payment.
          </p>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="mt-4 w-full rounded border px-4 py-2 hover:bg-gray-50"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
