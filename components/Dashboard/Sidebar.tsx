"use client";
import Link from "next/link";
import React from "react";
import { BiChat, BiEdit, BiLock, BiLogOut } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { ImProfile } from "react-icons/im";
import { MdMenu } from "react-icons/md";

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
      <div className="h-full px-3 py-4 overflow-y-auto bg-mainBlue">
        <div className="border-b-4 border-b-white flex justify-between items-center mb-2 py-3">
          <div className="border border-white bg-white p-2 rounded-lg text-mainBlue">
            <MdMenu />
          </div>
          <h1 className="text-center font-black text-white text-xl">AMS</h1>
        </div>
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <HiHome />
              <span className="ms-3">Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/profile"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <ImProfile />
              <span className="ms-3">My Profile</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/update-profile"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <BiEdit />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Edit Profile
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/chat"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <BiChat />
              <span className="flex-1 ms-3 whitespace-nowrap">Chat</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/notifications"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <BiLock />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Notifications
              </span>
              <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                3
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/change-password"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <BiLock />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Change Password
              </span>
            </Link>
          </li>
        </ul>
        <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200">
          <li>
            <Link
              href="#"
              className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
            >
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
