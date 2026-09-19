const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      <p className="mt-4 text-gray-400">{message}</p>
    </div>
  );
};

export default Loading;