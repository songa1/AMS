"use client";
import Link from "next/link";
import React from "react";
import { BiChat, BiEdit, BiLock, BiLogOut, BiUser } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { ImProfile } from "react-icons/im";
import { MdMenu } from "react-icons/md";
import { useUnopenedNotificationsQuery } from "@/lib/features/notificationSlice";
import { AUTH_STORED_DATA, getUser, token } from "@/helpers/auth";
import { useLogoutMutation } from "@/lib/features/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const user = getUser();
  const [logout] = useLogoutMutation();
  const { data } = useUnopenedNotificationsQuery(user?.id, {
    pollingInterval: 30000,
  });

  const notifications = data?.notifications ? data?.notifications : [];
  const isAdmin = user?.role?.name == "ADMIN";

  const handleLogout = async () => {
    const res = await logout({ userId: user?.id, token }).unwrap();
    if (res.status == 200) {
      Cookies.remove(AUTH_STORED_DATA?.TOKEN);
      Cookies.remove(AUTH_STORED_DATA?.USER);
      globalThis.location.href = "/";
    }
  };
  return (
    <aside className="top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0">
      <div className="h-full px-3 py-4 overflow-y-auto bg-mainBlue">
        <div className="border-b-4 border-b-white flex justify-between items-center mb-2 py-3">
          <div className="border border-white bg-white p-2 rounded-lg text-mainBlue">
            <MdMenu />
          </div>
          <h1 className="text-center font-black text-white text-xl">AMS</h1>
        </div>
        <ul className="space-y-2 font-medium">
          {isAdmin && (
            <li>
              <Link href="/dashboard" className="sidebar-menu">
                <HiHome />
                <span className="ms-3">Home</span>
              </Link>
            </li>
          )}
          <li>
            <Link href="/dashboard/profile" className="sidebar-menu">
              <ImProfile />
              <span className="ms-3">My Profile</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/update-profile" className="sidebar-menu">
              <BiEdit />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Edit Profile
              </span>
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link href="/dashboard/users" className="sidebar-menu">
                <BiUser />
                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
              </Link>
            </li>
          )}
          <li>
            <Link href="/dashboard/chat" className="sidebar-menu">
              <BiChat />
              <span className="flex-1 ms-3 whitespace-nowrap">Chat</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/notifications" className="sidebar-menu">
              <BiLock />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Notifications
              </span>
              {notifications.length > 0 && (
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  {notifications.length}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link href="/dashboard/change-password" className="sidebar-menu">
              <BiLock />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Reset Password
              </span>
            </Link>
          </li>
        </ul>
        <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200">
          <li onClick={handleLogout}>
            <Link href="/" className="sidebar-menu">
              <BiLogOut />
              <span className="ms-3">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
