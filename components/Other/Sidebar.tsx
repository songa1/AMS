// NAVIGATION.tsx
"use client";

import { Database, Settings } from "lucide-react";
import {
  MdDashboard,
  MdAccountBox,
  MdVpnKey,
  MdLogout,
  MdSettingsAccessibility,
  MdCorporateFare,
  MdFoundation,
  MdEdit,
  MdNotifications,
  MdChat,
  MdPeople,
  MdPersonAdd,
} from "react-icons/md";

export type NavItem = {
  segment: string;
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children?: NavItem[];
};

export type NavHeader = {
  kind: "header";
  title: string;
};

export type NavDivider = {
  kind: "divider";
};

export type NavItemType = NavItem | NavHeader | NavDivider;

const TailwindChip = ({ label }: { label: number }) => (
  <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-none text-blue-100 bg-primary rounded-full">
    {label}
  </span>
);

export const NAVIGATION: NavItemType[] = [
  {
    segment: "/dashboard",
    title: "Dashboard",
    icon: <MdDashboard className="w-5 h-5" />,
  },
  {
    kind: "header",
    title: "Your Profile",
  },
  {
    segment: "/dashboard/profile",
    title: "View Profile",
    icon: <MdAccountBox className="w-5 h-5" />,
  },
  {
    segment: "/dashboard/update-profile",
    title: "Edit Profile",
    icon: <MdEdit className="w-5 h-5" />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Communication",
  },
  {
    segment: "/dashboard/notifications",
    title: "Notifications",
    icon: <MdNotifications className="w-5 h-5" />,
  },
  {
    segment: "/dashboard/chat",
    title: "Chat",
    icon: <MdChat className="w-5 h-5" />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Users",
  },
  {
    segment: "/dashboard/members",
    title: "Members",
    icon: <MdPeople className="w-5 h-5" />,
  },
  {
    segment: "/dashboard/members/new",
    title: "Add New User",
    icon: <MdPersonAdd className="w-5 h-5" />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Security",
  },
  {
    segment: "/dashboard/change-password",
    title: "Change Password",
    icon: <MdVpnKey className="w-5 h-5" />,
  },
  {
    segment: "/dashboard/settings",
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    kind: "header",
    title: "Admin",
  },
  {
    segment: "/dashboard/data",
    title: "Data Management",
    icon: <Database className="w-5 h-5" />,
  },
];
