export const TailwindAlert = ({
  severity,
  children,
}: {
  severity: "success" | "error";
  children: React.ReactNode;
}) => {
  const baseClasses = "p-4 rounded-md text-sm mb-4";
  const colorClasses =
    severity === "success"
      ? "bg-green-100 text-green-700 border border-green-400"
      : "bg-red-100 text-red-700 border border-red-400";
  return <div className={`${baseClasses} ${colorClasses}`}>{children}</div>;
};
