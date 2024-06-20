import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";

function Loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <ProgressSpinner />
    </div>
  );
}

export default Loading;
