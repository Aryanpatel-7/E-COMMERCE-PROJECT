
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const statuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/orders/all", {
        headers: getHeaders(),
      });

      const fetchedOrders = response.data.orders || [];
      setOrders(fetchedOrders);

      const initialStatuses = {};
      fetchedOrders.forEach((order) => {
        initialStatuses[order._id] = order.status;
      });

      setSelectedStatuses(initialStatuses);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to fetch orders. Please check admin access."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = (orderId, status) => {
    setSelectedStatuses((previous) => ({
      ...previous,
      [orderId]: status,
    }));
  };

  const updateStatus = async (orderId) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      const status = selectedStatuses[orderId];

      const response = await API.put(
        `/orders/${orderId}`,
        { status },
        { headers: getHeaders() }
      );

      const updatedOrder = response.data.order;

      setOrders((previous) =>
        previous.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );

      setSelectedStatuses((previous) => ({
        ...previous,
        [orderId]: updatedOrder.status,
      }));

      setMessage("Order status updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update order status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading orders...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Admin Order Management
        </h1>

        <button
          onClick={fetchOrders}
          className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
        >
          Refresh Orders
        </button>
      </div>

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

      <p className="mb-4">
        Total Orders: <strong>{orders.length}</strong>
      </p>

      {orders.length === 0 && !error ? (
        <p className="rounded border p-5">No orders found.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-lg border p-4 shadow-sm sm:p-5"
            >
              <div className="mb-4 border-b pb-4">
                <p className="break-all text-sm text-gray-600">
                  Order ID: {order._id}
                </p>

                <p className="mt-2">
                  Date:{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "Not available"}
                </p>

                <p className="mt-2">
                  Customer: {order.user?.fullname || "Customer unavailable"}
                </p>

                <p>
                  Email: {order.user?.email || "Not available"}
                </p>

                <p className="mt-2 text-lg font-semibold">
                  Total: ₹{order.totalAmount}
                </p>

                <Link
                  to={`/my-orders/${order._id}`}
                  className="mt-2 inline-block text-blue-600 underline"
                >
                  View Order Details
                </Link>
              </div>

              <h2 className="mb-3 font-semibold">Products</h2>

              <div className="mb-5 space-y-3">
                {order.products?.map((item, index) => (
                  <div
                    key={item.product?._id || index}
                    className="rounded bg-gray-50 p-3"
                  >
                    <p className="font-medium">
                      {item.product?.name || "Product unavailable"}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    {item.product?.price != null && (
                      <p>Price: ₹{item.product.price}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label
                    htmlFor={`status-${order._id}`}
                    className="mb-1 block font-medium"
                  >
                    Update Order Status
                  </label>

                  <select
                    id={`status-${order._id}`}
                    value={
                      selectedStatuses[order._id] || order.status
                    }
                    onChange={(event) =>
                      handleStatusChange(order._id, event.target.value)
                    }
                    className="w-full rounded border p-2"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => updateStatus(order._id)}
                  disabled={
                    updatingId === order._id ||
                    selectedStatuses[order._id] === order.status
                  }
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatingId === order._id
                    ? "Updating..."
                    : "Save Status"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
