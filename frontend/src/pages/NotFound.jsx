import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-8xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        Page not found
      </h2>
      <p className="text-gray-500 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          to="/"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Go Home
        </Link>
        <Link
          to="/events"
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-6 py-2.5 rounded-lg font-medium transition-colors border border-gray-700"
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
};

export default NotFound;