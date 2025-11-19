import { Loader2 } from "lucide-react";
import { IconType } from "react-icons";

export const PageHeader = ({
  title,
  actionTitle,
  Icon,
  onAction,
  loading,
}: {
  title: string;
  actionTitle: string;
  Icon: IconType;
  onAction?: () => void;
  loading: boolean;
}) => (
  <div className="flex justify-between items-center mb-6 border-b pb-4">
    <h1 className="text-3xl font-bold text-gray-700">{title}</h1>
    <button
      onClick={onAction}
      className="flex items-center bg-primary text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-primary/70 transition-colors"
    >
      {!loading ? (
        <Icon className="w-5 h-5 mr-2" />
      ) : (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      )}
      {actionTitle}
    </button>
  </div>
);
