import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2">Page Not Found</p>
      <Link to="/" className="mt-4 inline-block text-blue-600 underline">
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;