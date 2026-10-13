
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(response.data.dashboard);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <p className="p-6 text-center">Loading admin dashboard...</p>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="mb-3 text-2xl font-bold">Admin Dashboard</h1>
        <p className="rounded bg-red-100 p-4 text-red-700">{error}</p>
        <p className="mt-3 text-sm text-gray-600">
          Check that you are logged in with an admin account.
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Products",
      value: dashboard.totalProducts,
    },
    {
      label: "Total Orders",
      value: dashboard.totalOrders,
    },
    {
      label: "Total Users",
      value: dashboard.totalUsers,
    },
    {
      label: "Total Categories",
      value: dashboard.totalCategories,
    },
    {
      label: "Pending Orders",
      value: dashboard.pendingOrders,
    },
    {
      label: "Order Sales Total",
      value: `₹${Number(dashboard.totalSales).toLocaleString("en-IN")}`,
    },
  ];

  const links = [
    { label: "Manage Orders", to: "/admin/orders" },
    { label: "Manage Products", to: "/admin/products" },
    { label: "Manage Categories", to: "/admin/categories" },
  ];

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
        Admin Dashboard
      </h1>

      <p className="mb-6 text-gray-600">
        Welcome to UrbanCart administration.
      </p>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="mt-2 `break-words` text-2xl font-bold">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg border p-5 font-semibold hover:bg-gray-50"
            >
              {item.label} →
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-6 text-sm text-gray-500">
        Sales total includes non-cancelled orders. It does not necessarily
        represent confirmed payments.
      </p>
    </main>
  );
}

export default AdminDashboard;
