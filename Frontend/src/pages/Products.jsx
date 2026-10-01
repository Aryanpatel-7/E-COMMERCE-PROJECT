import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");

        setProducts(response.data.products || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Our Products
      </h1>

      <p className="text-gray-600 text-center mt-2">
        Explore our latest collection.
      </p>

      {products.length === 0 ? (
        <p className="text-center mt-12 text-gray-600">
          No products available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
            >
              <img
                src={
                  product.image ||
                  "https://placehold.co/400x300?text=Product"
                }
                alt={product.name}
                className="w-full h-48 object-contain rounded-lg"
              />

              <h2 className="text-lg font-semibold text-gray-800 mt-4">
                {product.name}
              </h2>

              <p className="text-blue-600 text-xl font-bold mt-2">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {product.description}
              </p>

              <Link
                to={`/products/${product._id}`}
                className="block text-center mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
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

export default Products;