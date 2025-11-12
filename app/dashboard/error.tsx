"use client";

import { useRouter } from "next/navigation";

function ServerError() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 p-5">
      <h1 className="text-9xl font-extrabold text-red-600 mb-4 animate-pulse">
        500
      </h1>

      <h2 className="text-3xl font-semibold text-gray-800 mb-2">
        Oops! Something went wrong on our end.
      </h2>

      <p className="text-lg text-gray-600 mb-8">
        Please try again later or return to the homepage.
      </p>

      <button
        onClick={handleGoBack}
        className="px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg shadow-xl hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
      >
        Go to Homepage
      </button>
    </div>
  );
}

export default ServerError;