"use client";

import React from "react";

function DisplayField({ text }: { text: string | undefined }) {
  return (
    <div className="bg-gray-100 p-3 rounded-md">
      <p>{text || "---"}</p>
    </div>
  );
}

export default DisplayField;
