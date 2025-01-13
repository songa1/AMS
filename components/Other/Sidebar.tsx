"use client";

import { Navigation } from "@toolpad/core";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import FoundationIcon from "@mui/icons-material/Foundation";
import EditIcon from "@mui/icons-material/Edit";
import { Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";

export const NAVIGATION: Navigation = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    kind: "header",
    title: "Your Profile",
  },
  {
    segment: "dashboard/profile",
    title: "View Profile",
    icon: <AccountBoxIcon />,
  },
  {
    segment: "dashboard/update-profile",
    title: "Edit Profile",
    icon: <EditIcon />,
    children: [
      {
        segment: "/",
        title: "Personal Info",
        icon: <SettingsAccessibilityIcon />,
      },
      {
        segment: "/organization-founded",
        title: "Organization Founded",
        icon: <FoundationIcon />,
      },
      {
        segment: "/organization-employed",
        title: "Employment Info",
        icon: <CorporateFareIcon />,
      },
    ],
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Communication",
  },
  {
    segment: "dashboard/notifications",
    title: "Notifications",
    icon: <NotificationsIcon />,
    action: <Chip label={4} color="info" size="small" />,
  },
  {
    segment: "dashboard/chat",
    title: "Chat",
    icon: <ChatIcon />,
    action: <Chip label={4} color="info" size="small" />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Users",
  },
  {
    segment: "dashboard/users",
    title: "Members",
    icon: <PeopleIcon />,
  },
  {
    segment: "dashboard/add-new-user",
    title: "Add New User",
    icon: <PersonAddIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Security",
  },
  {
    segment: "dashboard/change-password",
    title: "Change Password",
    icon: <EnhancedEncryptionIcon />,
  },
  {
    segment: "dashboard/Settings",
    title: "Settings",
    icon: <SettingsIcon />,
  },
  {
    segment: "dashboard/logout",
    title: "Logout",
    icon: <LogoutIcon />,
  },
];
