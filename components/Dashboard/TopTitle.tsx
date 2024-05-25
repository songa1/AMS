"use client";

import React from "react";

function TopTitle({ title }: { title: string }) {
  return (
    <div className="flex w-full justify-between items-center mb-10">
      <h1 className="text-xl text-mainBlue font-bold">{title}</h1>
    </div>
  );
}

export default TopTitle;
