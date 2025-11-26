"use client";

import Link from "next/link";

function OneStat({
  title,
  numbers,
  icon,
  link,
}: {
  title: string;
  numbers: number;
  icon: any;
  link: string;
}) {
  return (
    <Link href={link}>
      <div className="bg-white rounded shadow p-10 flex flex-col items-center justify-center text-center gap-3 cursor-pointer">
        <div className="bg-blue-100 p-5 rounded-full">{icon}</div>
        <div>
          <h1 className="font-black text-3xl text-mainBlue">{numbers}</h1>
          <p className="text-gray-600">{title}</p>
        </div>
      </div>
    </Link>
  );
}

export default OneStat;
