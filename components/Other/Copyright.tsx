import Link from "next/link";

const Copyright = () => {
  const defaultClasses = "text-sm text-gray-500 text-center mt-6 font-sans";

  const combinedClasses = `${defaultClasses}`;

  return (
    <p className={combinedClasses}>
      {"Copyright © "}
      <Link
        href="#"
        className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150 font-medium"
      >
        Alumni Management System
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </p>
  );
};

export default Copyright;
