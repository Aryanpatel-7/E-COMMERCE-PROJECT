function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-blue-400">
           LaxmiMart
        </h2>

        <p className="mt-3 text-gray-300">
          Your one-stop shopping destination.
        </p>

        <p className="mt-6 text-sm text-gray-400">
          © {new Date().getFullYear()} LaxmiMart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;