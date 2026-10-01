import { Link } from "react-router-dom";

function Home() {
  const categories = [
    { name: "Mobiles", emoji: "📱" },
    { name: "Laptops", emoji: "💻" },
    { name: "Headphones", emoji: "🎧" },
    { name: "Accessories", emoji: "⌚" },
  ];

  const products = [
    {
      id: 1,
      name: "Smartphone",
      price: 14999,
      emoji: "📱",
    },
    {
      id: 2,
      name: "Laptop",
      price: 45999,
      emoji: "💻",
    },
    {
      id: 3,
      name: "Headphones",
      price: 1999,
      emoji: "🎧",
    },
    {
      id: 4,
      name: "Smart Watch",
      price: 2999,
      emoji: "⌚",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <p className="text-blue-100 font-semibold mb-3">
              Welcome to LaxmiMart
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Shop Smart, Live Better
            </h1>

            <p className="mt-6 text-lg text-blue-100">
              Discover amazing products at great prices.
              Your favorite shopping destination is here.
            </p>

            <Link
              to="/products"
              className="inline-block mt-8 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Shop Now
            </Link>
          </div>

          <div className="text-9xl">
            🛍️
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white shadow-md rounded-xl p-8 text-center hover:shadow-xl transition"
            >
              <div className="text-5xl">{category.emoji}</div>

              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Featured Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition"
              >
                <div className="text-7xl py-6">
                  {product.emoji}
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>

                <p className="text-blue-600 font-bold text-xl mt-2">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <Link
                  to="/products"
                  className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Products
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Ready to Start Shopping?
        </h2>

        <p className="text-gray-600 mt-3">
          Explore our collection and find what you need.
        </p>

        <Link
          to="/products"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Explore Products
        </Link>
      </section>
    </div>
  );
}

export default Home;