import { Loader2 } from "lucide-react";
import { IconType } from "react-icons";
import { GoBlocked } from "react-icons/go";

export const PageHeader = ({
  title,
  description,
  actionTitle,
  Icon,
  onAction,
  loading,
  disabled,
}: {
  title: string;
  description?: string;
  actionTitle: string;
  Icon: IconType;
  onAction?: () => void;
  loading: boolean;
  disabled: boolean;
}) => (
  <div className="flex justify-between items-center mb-6 border-b pb-4">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
      <p className="text-gray-500 mt-1">{description} </p>
    </div>{" "}
    <button
      onClick={onAction}
      disabled={disabled || loading}
      className={`flex items-center text-white font-semibold py-2 px-4 rounded shadow-md transition-colors ${
        disabled ? "bg-gray-600" : "bg-primary hover:bg-primary/70"
      }`}
    >
      {disabled ? null : (
        <div>
          {loading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Icon className="w-5 h-5 mr-2" />
          )}
        </div>
      )}
      {disabled ? <GoBlocked /> : actionTitle}
    </button>
  </div>
);
