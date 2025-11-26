interface CustomButtonProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md transition duration-200 ${
      disabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700"
    }`}
  >
    {children}
  </button>
);
