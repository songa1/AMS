"use client";

import React from "react";

function Header() {
  return (
    <div className="w-full p-2 flex justify-center items-center flex-col py-5 gap-5">
      <img src="/yali.png" width={200} />
      <h2 className="text-mainBlue text-center text-2xl font-extrabold text-gray-900">
        ALUMNI MANAGEMENT SYSTEM!
      </h2>
    </div>
  );
}

export default Header;
