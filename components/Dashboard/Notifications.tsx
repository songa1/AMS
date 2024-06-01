"use client";

import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";

export const nots = [
  {
    id: 2,
    title: "Welcome to AMS!",
    description:
      "<p>Hi Sophie,<br><p>We are glad to welcome you to AMS! You are welcome in the family!</p><p>To get started, <ul><li>Update your profile</li><li>Introduce yourself in the community chat,</li><li>Check Notifications for new updates</li></ul><p>Again, you are most welcome to the community</p><p>Best Regards,<br>The Admin</p>",
    createdAt: "2020-03-04",
    isRead: true,
  },
  {
    id: 1,
    title: "You Need to update your profile!",
    description:
      "<p>Hi Sophie,<br><p>We noticed that you have not updated your profile in a long time,so we are reaching out to remind you to update your information.</p><p>Some of the information you might need to update include:</p><ul><li>Your address,</li><li>Your profile picture,</li><li>Your biography,</li></ul><p>Kindly update this information as soon as you can to keep your information up to date!</p><div><a href='/dashboard/update-profile'>Update</a><a href='/dashboard/profile'>Not Updating</a></div><p>We hope you keep having a great time. Move around and chat withfriends!</p><p>Best Regards,<br>The Admin</p>",
    createdAt: "2024-03-04",
    isRead: false,
  },
];

function Notifications() {
  dayjs.extend(relativeTime);
  const [notifications, setNotifications] = useState(nots);
  const [currentNotification, setCurrentNotification] = useState<number>();
  const [notification, setNotification] = useState<string | null>();

  useEffect(() => {
    if (currentNotification) {
      setNotification(
        notifications.find((noti) => noti.id == currentNotification)
          ?.description
      );
    }
  }, [currentNotification]);

  return (
    <div className="notifications">
      <div className="notifications-left">
        <h1 className="noti-sticky-header">Inbox</h1>
        <ul className="flex flex-col gap-1">
          {notifications.length > 0 ? (
            notifications
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((noti, index: number) => (
                <li
                  key={index + 1}
                  className="border-b border-gray-200 p-2 px-4 cursor-pointer hover:bg-blue-100"
                  onClick={() => setCurrentNotification(noti?.id)}
                >
                  <div>
                    <p className="text-xs text-mainBlue">
                      {dayjs(noti?.createdAt).fromNow()}
                    </p>
                    <p className={`${!noti.isRead ? "font-bold" : ""}`}>
                      {noti.title}
                    </p>
                  </div>
                </li>
              ))
          ) : (
            <p className="py-4 px-2 text-center text-xs">
              No Notifications for Now! Check back later!
            </p>
          )}
        </ul>
      </div>
      <div className="notifications-right">
        <div className="noti-sticky-header">
          {currentNotification
            ? "You are required to update your profile"
            : "No notification selected!"}
        </div>
        {currentNotification && notification && (
          <div
            className="p-5 flex flex-col gap-5 notification"
            dangerouslySetInnerHTML={{
              __html: notification,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
