const ErrorDisplay = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-red-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-red-400 font-medium">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;