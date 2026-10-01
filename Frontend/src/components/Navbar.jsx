import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          LAXMI MART
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>

          <Link
            to="/products"
            className="text-gray-700 hover:text-blue-600"
          >
            Products
          </Link>

          <Link to="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>

          <Link
            to="/signup"
            className="text-gray-700 hover:text-blue-600"
          >
            Signup
          </Link>

          <Link
            to="/cart"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;