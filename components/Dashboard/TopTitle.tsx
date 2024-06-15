"use client";

import { getUser } from "@/helpers/auth";
import { User } from "@/types/user";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";

function TopTitle({ title }: { title: string }) {
  const user = getUser();
  return (
    <div className="flex w-full justify-between items-center mb-10 border-b border-gray-200 p-2 cursor-pointer">
      <h1 className="text-xl text-mainBlue font-bold">{title}</h1>
      <div className="flex gap-3 items-center">
        <div className="flex flex-col items-start">
          <div className="flex gap-0 items-center">
            <h2 className="text-md font-bold">{user?.firstName}</h2>
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
