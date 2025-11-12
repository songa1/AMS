import React from "react";

const TailwindSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

function Loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <TailwindSpinner />
    </div>
  );
}

export default Loading;
