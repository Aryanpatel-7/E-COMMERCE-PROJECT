
import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders.");
        return;
      }

      const response = await API.get("/orders/myorders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const classes = {
      Pending: "bg-yellow-100 text-yellow-800",
      Confirmed: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };

    return classes[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xl">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-red-600">{error}</p>

        <button
          onClick={fetchOrders}
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-xl bg-gray-50 px-6 py-16 text-center">
          <div className="mb-4 text-6xl">📦</div>

          <h2 className="text-2xl font-semibold text-gray-800">
            No orders yet
          </h2>

          <p className="mt-2 text-gray-500">
            Your placed orders will appear here.
          </p>

          <a
            href="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 border-b bg-gray-50 p-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="break-all font-semibold text-gray-800">
                    {order._id}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Ordered on:{" "}
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm text-gray-500">
                    Order Status
                  </p>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-5">
                {(order.products || []).map((item, index) => {
                  const product = item.product;

                  return (
                    <div
                      key={product?._id || index}
                      className="flex flex-col gap-4 border-b pb-4 last:border-b-0 sm:flex-row sm:items-center"
                    >
                      <img
                        src={
                          product?.image ||
                          "https://placehold.co/120x100?text=Product"
                        }
                        alt={product?.name || "Product"}
                        className="h-24 w-24 rounded-lg border object-contain"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {product?.name || "Product unavailable"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        {product?.price != null && (
                          <p className="mt-1 text-blue-600">
                            ₹
                            {Number(product.price).toLocaleString(
                              "en-IN"
                            )}{" "}
                            each
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between border-t p-5">
                <span className="font-semibold text-gray-700">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-blue-600">
                  ₹
                  {Number(order.totalAmount || 0).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
              <Link
  to={`/my-orders/${order._id}`}
  className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
>
  View Details
</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
