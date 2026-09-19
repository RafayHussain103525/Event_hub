import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-gray-400 font-semibold">EventHub</span>
          </div>

          <div className="flex gap-6 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link to="/events" className="text-gray-500 hover:text-gray-300 transition-colors">
              Browse Events
            </Link>
            <Link to="/signup" className="text-gray-500 hover:text-gray-300 transition-colors">
              Sign Up
            </Link>
          </div>

          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;