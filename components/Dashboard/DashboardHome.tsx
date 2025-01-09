"use client";

import React from "react";
import { BiEnvelope, BiNotification, BiUser } from "react-icons/bi";
import OneStat from "../Other/OneStat";
import { MdOutlinePending } from "react-icons/md";
import { FaMessage } from "react-icons/fa6";
import { useStatsQuery } from "@/lib/features/statsSlice";
import Loading from "@/app/loading";
import { Box } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

function DashboardHome() {
  const { data: StatsData, isLoading } = useStatsQuery("");
  const stats = [
    {
      id: 1,
      icon: (
        <GroupIcon color="primary" sx={{ width: "70px", height: "70px" }} />
      ),
      number: StatsData?.users,
      title: "Users",
      link: "/dashboard/users",
    },
    {
      id: 2,
      icon: (
        <CorporateFareIcon
          color="primary"
          sx={{ width: "70px", height: "70px" }}
        />
      ),
      number: StatsData?.organizations,
      title: "Organizations",
      link: "#",
    },
    {
      id: 3,
      icon: (
        <NotificationsActiveIcon
          color="primary"
          sx={{ width: "70px", height: "70px" }}
        />
      ),
      number: StatsData?.notificationsUnopened,
      title: "Pending Notifications",
      link: "#",
    },
    {
      id: 4,
      icon: (
        <NotificationsNoneIcon
          color="primary"
          sx={{ width: "70px", height: "70px" }}
        />
      ),
      number: StatsData?.sentNotifications,
      title: "All Notifications",
      link: "/dashboard/notifications",
    },
    {
      id: 5,
      icon: (
        <MessageIcon color="primary" sx={{ width: "70px", height: "70px" }} />
      ),
      number: StatsData?.messages,
      title: "All Messages sent",
      link: "#",
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
        gap: 2,
      }}
    >
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
    </Box>
  );
}

export default DashboardHome;
