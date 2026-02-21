
export const LoadingSpinner = ( {message = "Loading..."} ) => {
  return (
    <div className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        
        {/* Text */}
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};