import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <AuthProvider>
    
    <BrowserRouter>
   
    <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

       {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

       <Footer />
    </BrowserRouter>

    </AuthProvider>
  );
}

export default App;