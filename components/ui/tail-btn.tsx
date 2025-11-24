export const TailwindButton = ({
  onClick,
  children,
  className = "",
  disabled = false,
  icon: IconComponent = null,
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center px-4 py-2 font-semibold text-white rounded-md transition duration-150 ease-in-out 
${
  disabled
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
} 
${className}`}
  >
    {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
    {children} 
  </button>
);
