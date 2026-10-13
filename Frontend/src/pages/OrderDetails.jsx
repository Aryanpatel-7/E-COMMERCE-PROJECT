
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await API.get(`/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(response.data.order);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4 text-red-600">
          {error || "Order not found"}
        </p>
        <Link to="/my-orders" className="text-blue-600 underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const address = order.shippingAddress;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link
        to="/my-orders"
        className="mb-5 inline-block text-blue-600 hover:underline"
      >
        ← Back to My Orders
      </Link>

      <h1 className="mb-2 text-2xl font-bold">Order Details</h1>

      <div className="mb-6 rounded-lg border p-4">
        <p className="break-all">
          <strong>Order ID:</strong> {order._id}
        </p>

        <p className="mt-2">
          <strong>Order Date:</strong>{" "}
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString()
            : "Not available"}
        </p>

        <p className="mt-2">
          <strong>Status:</strong> {order.status}
        </p>

        <p className="mt-2 text-lg font-semibold">
          Total Amount: ₹{order.totalAmount}
        </p>
      </div>

      <h2 className="mb-3 text-xl font-semibold">Ordered Products</h2>

      <div className="mb-6 space-y-4">
        {order.products?.map((item, index) => {
          const product = item.product;

          return (
            <div
              key={product?._id || index}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
            >
              {product?.image && (
                <img
                  src={product.image}
                  alt={product.name || "Product"}
                  className="h-24 w-24 rounded object-contain"
                />
              )}

              <div className="flex-1">
                <h3 className="font-semibold">
                  {product?.name || "Product unavailable"}
                </h3>

                <p className="mt-1">
                  Quantity: {item.quantity}
                </p>

                {product?.price != null && (
                  <p className="mt-1">
                    Price: ₹{product.price}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 text-xl font-semibold">Shipping Address</h2>

      <div className="rounded-lg border p-4">
        {address ? (
          <>
            <p><strong>Name:</strong> {address.fullname}</p>
            <p><strong>Phone:</strong> {address.phone}</p>
            <p><strong>Address:</strong> {address.address}</p>
            <p><strong>City:</strong> {address.city}</p>
            <p><strong>State:</strong> {address.state}</p>
            <p><strong>Pincode:</strong> {address.pincode}</p>
          </>
        ) : (
          <p>Shipping address not available for this order.</p>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
