"use client";

import React from "react";
import { BiEnvelope, BiUser } from "react-icons/bi";
import OneStat from "../Other/OneStat";
import { MdOutlinePending } from "react-icons/md";
import { FaMessage } from "react-icons/fa6";

function DashboardHome() {
  const stats = [
    {
      id: 1,
      icon: <BiUser className="text-mainBlue" size={30} />,
      number: 234,
      title: "Users",
      link: "/",
    },
    {
      id: 2,
      icon: <BiEnvelope className="text-mainBlue" size={30} />,
      number: 234,
      title: "Messages",
      link: "/",
    },
    {
      id: 3,
      icon: <MdOutlinePending className="text-mainBlue" size={30} />,
      number: 234,
      title: "Pending Updates",
      link: "/",
    },
    {
      id: 4,
      icon: <FaMessage className="text-mainBlue" size={30} />,
      number: 100,
      title: "Unread Messages",
      link: "/",
    },
  ];
  return (
    <div>
      <div className="grid justify-between items-center gap-5 grid-cols-4">
        {stats &&
          stats.map((stat) => (
            <OneStat
              link={stat.link}
              icon={stat.icon}
              title={stat.title}
              numbers={stat.number}
              key={stat.id}
            />
          ))}
      </div>
    </div>
  );
}

export default DashboardHome;
