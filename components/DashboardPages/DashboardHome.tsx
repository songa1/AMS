"use client";

import React, { useMemo } from "react";
import {
  User,
  MessageSquare,
  Clock,
  Bell,
  BarChart,
  Trophy,
  Loader2,
  Activity,
} from "lucide-react";
import { useStatsQuery } from "@/lib/features/statsSlice";
import Link from "next/link";

interface UserActivity {
  id: string;
  name: string;
  messagesSent: number;
}

const MOCK_TOP_USERS: UserActivity[] = [
  { id: "u1", name: "Alice M.", messagesSent: 450 },
  { id: "u2", name: "Bob J.", messagesSent: 320 },
  { id: "u3", name: "Charlie P.", messagesSent: 280 },
];

const MOCK_RECENT_EVENTS = [
  {
    id: 1,
    type: "User Joined",
    description: "New member Jane Doe registered.",
    time: "2 mins ago",
  },
  {
    id: 2,
    type: "Maintenance",
    description: "Database backup completed successfully.",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "High Activity",
    description: "Message volume spiked by 15% today.",
    time: "4 hours ago",
  },
];

const Loading = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="animate-spin w-8 h-8 text-primary" />
  </div>
);

interface StatCardProps {
  title: string;
  numbers: number;
  icon: React.ReactNode;
  link: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  numbers,
  icon,
  link,
  color,
}) => {
  const shadowColor = `shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5`;

  return (
    <Link href={link} className={`block ${shadowColor} rounded-2xl`}>
      <div
        className={`bg-white border-l-4 border-${color}-500 p-6 flex items-center space-x-4 h-full rounded-2xl overflow-hidden`}
      >
        <div
          className={`p-3 rounded-full bg-${color}-100 text-${color}-600 shrink-0`}
        >
          {icon}
        </div>
        <div className="grow">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <h1 className="font-extrabold text-3xl text-gray-800 mt-1">
            {numbers.toLocaleString()}
          </h1>
        </div>
      </div>
    </Link>
  );
};

const DashboardHome = () => {
  const { data: StatsData, isLoading } = useStatsQuery("");

  const stats = useMemo(
    () => [
      {
        id: 1,
        icon: <User size={24} />,
        number: StatsData?.users || 0,
        title: "Total Members",
        link: "/dashboard/members",
        color: "blue",
      },
      {
        id: 2,
        icon: <MessageSquare size={24} />,
        number: StatsData?.messages || 0,
        title: "Total Messages",
        link: "/dashboard/chat",
        color: "blue",
      },
      {
        id: 3,
        icon: <Clock size={24} />,
        number: StatsData?.notificationsUnopened || 0,
        title: "Unresolved Tasks",
        link: "#",
        color: "amber",
      },
      {
        id: 4,
        icon: <Bell size={24} />,
        number: StatsData?.sentNotifications || 0,
        title: "Notifications Sent",
        link: "/dashboard/notifications",
        color: "green",
      },
    ],
    [StatsData]
  );

  if (isLoading) {
    return <Loading />;
  }

  const ActivityTrendCard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-96 flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <BarChart className="w-5 h-5 mr-2 text-primary" />
        7-Day Activity Trend
      </h3>
      <div className="flex-1 flex justify-center items-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400">
        <p>
          <br />
          Chart Placeholder: Messaging Volume
        </p>
      </div>
    </div>
  );

  const TopUsersCard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-96 flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" />
        Top 3 Active Members
      </h3>
      <ul className="space-y-3">
        {MOCK_TOP_USERS.map((user, index) => (
          <li
            key={user.id}
            className="flex justify-between items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex items-center space-x-3">
              <span
                className={`font-bold text-lg w-6 text-center ${
                  index === 0 ? "text-yellow-500" : "text-gray-400"
                }`}
              >
                #{index + 1}
              </span>
              <span className="font-medium text-gray-700">{user.name}</span>
            </div>
            <span className="text-sm font-semibold text-primary">
              {user.messagesSent.toLocaleString()} Messages
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <a
          href="/dashboard/members"
          className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
        >
          View full leaderboard
        </a>
      </div>
    </div>
  );

  const RecentEventsCard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg lg:col-span-1 h-96 flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-red-500" />
        Recent System Activity
      </h3>
      <ul className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        {MOCK_RECENT_EVENTS.map((event) => (
          <li
            key={event.id}
            className="border-b border-gray-100 pb-3 last:border-b-0"
          >
            <p className="text-sm font-semibold text-gray-800">{event.type}</p>
            <p className="text-xs text-gray-600 my-0.5">{event.description}</p>
            <p className="text-xs text-primary font-medium">{event.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-full font-sans">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Dashboard Overview
      </h1>
      <p className="text-gray-600 mb-8">
        Welcome back! Here's a summary of your system's performance and
        activity.
      </p>

      {/* --- 1. Key Performance Indicators (KPIs) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <StatCard
            link={stat.link}
            icon={stat.icon}
            title={stat.title}
            numbers={stat.number}
            color={stat.color}
            key={stat.id}
          />
        ))}
      </div>

      {/* --- 2. Advanced Insights and Analytics --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Trend (2/3 width) */}
        <div className="lg:col-span-2">
          <ActivityTrendCard />
        </div>

        {/* Top Users (1/3 width) */}
        <TopUsersCard />

        {/* Recent Events (1/3 width, standalone if needed, but grouped above) */}
        {/* If you wanted this to span the full width of the main grid, it would be here */}
      </div>

      {/* Adding Recent Events in a new section or swapping with TopUsers if preferred */}
      <div className="mt-6">
        <RecentEventsCard />
      </div>
    </div>
  );
};

export default DashboardHome;
