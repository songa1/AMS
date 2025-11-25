import { MdLockOpen, MdSecurity } from "react-icons/md";

export const RoleChip = ({
  roleName,
  onClick,
}: {
  roleName: string;
  onClick: () => void;
}) => {
  const isAdmin = roleName === "ADMIN";
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200
        ${
          isAdmin
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-blue-100 text-primary hover:bg-blue-200"
        }
        ${isAdmin && "cursor-pointer"}
      `}
      title={isAdmin ? "Click to change role" : "Only ADMIN can change roles"}
      disabled={!isAdmin}
    >
      {isAdmin ? (
        <MdSecurity className="w-3 h-3 mr-1" />
      ) : (
        <MdLockOpen className="w-3 h-3 mr-1" />
      )}
      {roleName}
    </button>
  );
};
