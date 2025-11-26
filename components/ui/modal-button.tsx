export const ModalButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant: "confirm" | "cancel";
  disabled?: boolean;
}> = ({ children, onClick, variant, disabled = false }) => {
  const baseStyle =
    "px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm";

  if (variant === "confirm") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyle} bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70`}
    >
      {children}
    </button>
  );
};
