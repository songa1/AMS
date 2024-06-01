"use client";

import dayjs from "dayjs";
import React from "react";

function Notifications() {
  return (
    <div className="notifications">
      <div className="notifications-left">
        <ul className="flex flex-col gap-1">
          <li className="border-b border-gray-200 p-2 cursor-pointer hover:bg-blue-100 rounded">
            <div>
              <p className="text-xs text-mainBlue">
                {dayjs("1992-02-03").format()}
              </p>
              <p className="font-bold">
                You are required to update your profile!
              </p>
            </div>
          </li>
          <li className="border-b border-gray-200 p-2 cursor-pointer hover:bg-blue-100 rounded">
            <div>
              <p className="text-xs text-mainBlue">
                {dayjs("1992-02-03").format()}
              </p>
              <p className="font-bold">
                You are required to update your profile!
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div className="notifications-right"></div>
    </div>
  );
}

export default Notifications;
