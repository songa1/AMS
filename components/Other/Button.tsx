"use client";

import React from "react";

function Button({ title, onClick }: { title: string; onClick: any }) {
  return (
    <button
      className="select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
      type="submit"
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default Button;
