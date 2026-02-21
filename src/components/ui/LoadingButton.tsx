interface LoadingButtonProps{
    isLoading: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
   
}

export const LoadingButton = ({
    isLoading,
    children,
    onClick,
    variant = "primary",
    type = "button",
}: LoadingButtonProps) => {
     const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        danger: "bg-red-600 hover:bg-red-700 text-white"
    };
return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`
        ${variants[variant]} 
        px-4 py-2 rounded-lg font-medium 
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        flex items-center justify-center gap-2
      `}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};