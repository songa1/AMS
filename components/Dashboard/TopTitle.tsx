"use client";

import Image from "next/image";
import React from "react";
import { GoDotFill } from "react-icons/go";

function TopTitle({ title }: { title: string }) {
  return (
    <div className="flex w-full justify-between items-center mb-10 border-b p-2">
      <h1 className="text-xl text-mainBlue font-bold">{title}</h1>
      <div className="flex gap-3 items-center">
        <div className="flex flex-col items-start">
          <div className="flex gap-0 items-center">
            <h2 className="text-md font-bold">Sophie</h2>
            <GoDotFill className="text-mainBlue" />
          </div>
          <p className="text-xs text-mainBlue">Admin</p>
        </div>
        <Image
          src="/profile.jpg"
          width={50}
          height={50}
          className="rounded-full object-cover"
          alt="Profile"
        />
      </div>
    </div>
  );
}

export default TopTitle;
