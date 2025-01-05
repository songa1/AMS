"use client";

// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import {
//   BiBell,
//   BiChat,
//   BiEdit,
//   BiLock,
//   BiLogOut,
//   BiUser,
// } from "react-icons/bi";
// import { HiHome } from "react-icons/hi";
// import { ImProfile } from "react-icons/im";
// import { MdMenu } from "react-icons/md";
// import { useUnopenedNotificationsQuery } from "@/lib/features/notificationSlice";
// import { AUTH_STORED_DATA, getUser, token } from "@/helpers/auth";
// import { useLogoutMutation } from "@/lib/features/authSlice";
// import Cookies from "js-cookie";
// import { usePathname } from "next/navigation";
// import { CiSettings } from "react-icons/ci";
// import {
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   ListSubheader,
// } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";
import { Navigation } from "@toolpad/core";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import FoundationIcon from "@mui/icons-material/Foundation";
import EditIcon from "@mui/icons-material/Edit";
import { Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";

export const NAVIGATION: Navigation = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    kind: "header",
    title: "Profile",
  },
  {
    segment: "dashboard/profile",
    title: "View Profile",
    icon: <AccountBoxIcon />,
  },
  {
    segment: "update-profile",
    title: "Edit Profile",
    icon: <EditIcon />,
    children: [
      {
        segment: "dashboard/update-profile",
        title: "Personal Info",
        icon: <SettingsAccessibilityIcon />,
      },
      {
        segment: "dashboard/update-profile",
        title: "Organization Info",
        icon: <FoundationIcon />,
      },
      {
        segment: "dashboard/update-profile",
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
    title: "Security",
  },
  {
    segment: "dashboard/change-password",
    title: "Change Password",
    icon: <EnhancedEncryptionIcon />,
  },
  {
    segment: "logout",
    title: "Logout",
    icon: <LogoutIcon />,
  },
];

// const Sidebar = ({
//   titles,
//   setTitles,
// }: {
//   titles: boolean;
//   setTitles: any;
// }) => {
//   const user = getUser();
//   const link = usePathname();
//   const isMobile = typeof window !== "undefined" && window?.innerWidth <= 768;

//   const [logout] = useLogoutMutation();
//   const { data } = useUnopenedNotificationsQuery(user?.id, {
//     pollingInterval: 30000,
//   });

//   useEffect(() => {
//     if (isMobile) {
//       setTitles(false);
//     }
//   }, [titles, setTitles, isMobile]);

//   const handleToggleTitles = () => {
//     setTitles(!titles);
//   };

//   const notifications = data?.notifications ? data?.notifications : [];
//   const isAdmin = user?.role?.name == "ADMIN";

//   const handleLogout = async () => {
//     const res = await logout({ userId: user?.id, token }).unwrap();
//     if (res.status == 200) {
//       Cookies.remove(AUTH_STORED_DATA?.TOKEN);
//       Cookies.remove(AUTH_STORED_DATA?.USER);
//       globalThis.location.href = "/";
//     }
//   };

//   const navs = [
//     {
//       id: 1,
//       title: "Home",
//       icon: <HiHome />,
//       link: "/dashboard",
//       show: !isAdmin ? false : true,
//       count: 0,
//     },
//     {
//       id: 2,
//       title: "My Profile",
//       icon: <ImProfile />,
//       link: "/dashboard/profile",
//       show: true,
//       count: 0,
//     },
//     {
//       id: 3,
//       title: "Update Profile",
//       icon: <BiEdit />,
//       link: "/dashboard/update-profile",
//       show: true,
//       count: 0,
//     },
//     {
//       id: 4,
//       title: "Users",
//       icon: <BiUser />,
//       link: "/dashboard/users",
//       show: true,
//       count: 0,
//     },
//     {
//       id: 5,
//       title: "Messages",
//       icon: <BiChat />,
//       link: "/dashboard/chat",
//       show: true,
//       count: 0,
//     },
//     {
//       id: 6,
//       title: "Notifications",
//       icon: <BiBell />,
//       link: "/dashboard/notifications",
//       show: true,
//       count: notifications.length,
//     },
//     {
//       id: 7,
//       title: "Change Password",
//       icon: <BiLock />,
//       link: "/dashboard/change-password",
//       show: true,
//       count: 0,
//     },
//     {
//       id: 8,
//       title: "Settings",
//       icon: <CiSettings />,
//       link: "/dashboard/settings",
//       show: !isAdmin ? false : true,
//       count: 0,
//     },
//   ];

//   return (
//     <aside
//       className={`top-0 left-0 h-full bg-mainBlue ${
//         !titles ? "w-16" : "w-60"
//       } fixed top-0 bottom-0 left-0`}
//     >
//       <div className="h-full px-3 py-4 overflow-y-auto h-full">
//         <div className="border-b-4 border-b-white flex justify-between items-center mb-2 py-3">
//           <div
//             className="border border-white bg-white p-2 rounded-lg text-mainBlue cursor-pointer"
//             onClick={handleToggleTitles}
//           >
//             <MdMenu />
//           </div>
//           {titles && (
//             // <h1 className="text-center font-black text-white text-xl">AMS</h1>
//             <img
//               src="/yali.png"
//               height={20}
//               width={100}
//               className="rounded-md"
//             />
//           )}
//         </div>
//         {/* <List
//           component="nav"
//           subheader={
//             <ListSubheader component="div" id="nested-list-subheader">
//               Main Menu
//             </ListSubheader>
//           }
//         >
//           <ListItemButton>
//             <ListItemIcon>
//               <HomeIcon />
//             </ListItemIcon>
//             <ListItemText primary="Home" />
//           </ListItemButton>
//         </List> */}
//         <ul className="space-y-2 font-medium">
//           {navs.map((nav) => {
//             if (nav?.show) {
//               return (
//                 <li
//                   key={nav?.id}
//                   style={{
//                     display: titles ? "" : "flex",
//                     justifyContent: titles ? "" : "center",
//                   }}
//                   className={`${
//                     link == nav?.link ? "bg-gray-800 rounded-lg" : ""
//                   }`}
//                 >
//                   <div
//                     onClick={() => (globalThis.location.href = nav?.link)}
//                     className="sidebar-menu cursor-pointer"
//                   >
//                     {nav?.icon}
//                     <span className="flex-1 ms-3 whitespace-nowrap">
//                       {titles && nav?.title}
//                     </span>
//                     {nav?.count > 0 && (
//                       <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
//                         {nav?.count}
//                       </span>
//                     )}
//                   </div>
//                 </li>
//               );
//             }
//           })}
//         </ul>
//         <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200">
//           <li onClick={handleLogout}>
//             <Link href="/" className="sidebar-menu">
//               <BiLogOut />
//               {titles && <span className="ms-3">Logout</span>}
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
