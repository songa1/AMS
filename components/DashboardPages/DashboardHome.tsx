"use client";

import { BiEnvelope, BiNotification, BiUser } from "react-icons/bi";
import OneStat from "../Other/OneStat";
import { MdOutlinePending } from "react-icons/md";
import { useStatsQuery } from "@/lib/features/statsSlice";
import Loading from "@/app/loading";

function DashboardHome() {
  const { data: StatsData, isLoading } = useStatsQuery("");
  const stats = [
    {
      id: 1,
      icon: <BiUser className="text-mainBlue" size={30} />,
      number: StatsData?.users,
      title: "Users",
      link: "/dashboard/users",
    },
    {
      id: 2,
      icon: <BiEnvelope className="text-mainBlue" size={30} />,
      number: StatsData?.messages,
      title: "Messages",
      link: "/dashboard/chat",
    },
    {
      id: 3,
      icon: <MdOutlinePending className="text-mainBlue" size={30} />,
      number: StatsData?.notificationsUnopened,
      title: "Pending Updates",
      link: "#",
    },
    {
      id: 4,
      icon: <BiNotification className="text-mainBlue" size={30} />,
      number: StatsData?.sentNotifications,
      title: "Notifications",
      link: "/dashboard/notifications",
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="grid justify-between items-center gap-5 md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-1">
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
