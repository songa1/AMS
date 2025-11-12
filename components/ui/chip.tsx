interface CustomChipProps {
  label: string;
  onClick: () => void;
  color?: "primary" | "secondary";
}

export const CustomChip: React.FC<CustomChipProps> = ({
  label,
  onClick,
  color = "primary",
}) => {
  const baseStyle =
    "px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer transition duration-150";
  const primaryStyle =
    "bg-blue-100 text-blue-800 border-blue-400 hover:bg-blue-200";
  const secondaryStyle =
    "bg-gray-100 text-gray-800 border-gray-400 hover:bg-gray-200";

  return (
    <span
      onClick={onClick}
      className={`${baseStyle} ${color === "primary" ? primaryStyle : secondaryStyle}`}
    >
      {label}
    </span>
  );
};
