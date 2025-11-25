import { Loader2 } from "lucide-react";
import { IconType } from "react-icons";

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
      className="flex items-center bg-primary text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-primary/70 transition-colors"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <Icon className="w-5 h-5 mr-2" />
      )}
      {actionTitle}
    </button>
  </div>
);
