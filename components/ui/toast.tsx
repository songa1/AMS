interface ToastNotificationProps {
  type: "success" | "error" | "info";
  message: string;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  type,
  message,
  onClose,
}) => {
  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon = type === "success" ? "✅" : "❌";

  return (
    <div
      className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-xl text-white ${bgColor} transition-opacity duration-300`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="text-xl mr-2">{icon}</span>
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
