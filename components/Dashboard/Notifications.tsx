"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useNotificationsQuery,
  useOpenNotificationMutation,
} from "@/lib/features/notificationSlice";
import { getUser } from "@/helpers/auth";

function Notifications() {
  dayjs.extend(relativeTime);
  const [notifications, setNotifications] = useState<any>([]);
  const [currentNotification, setCurrentNotification] = useState<string>();
  const [notification, setNotification] = useState<string | null>();
  const user = getUser();

  const { data, refetch } = useNotificationsQuery(user?.id);
  const [openNotification] = useOpenNotificationMutation();

  const nots = data?.notifications ? data?.notifications : [];

  useEffect(() => {
    if (data) {
      setNotifications(nots);
    }
    if (currentNotification) {
      setNotification(
        notifications.find((noti: any) => noti.id == currentNotification)
          ?.message
      );
    }
  }, [currentNotification, data, nots]);

  const handleOpenNotification = async (id: string) => {
    await openNotification({ id: id });
    refetch();
    setCurrentNotification(id);
  };

  return (
    <div className="notifications">
      <div className="notifications-left">
        <h1 className="noti-sticky-header">Inbox</h1>
        <ul className="flex flex-col gap-1">
          {notifications ? (
            [...notifications]
              .sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((noti: any, index: number) => (
                <li
                  key={index + 1}
                  className="border-b border-gray-200 p-2 px-4 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleOpenNotification(noti?.id)}
                >
                  <div>
                    <p className="text-xs text-mainBlue">
                      {dayjs(noti?.createdAt).fromNow()}
                    </p>
                    <p className={`${!noti?.opened ? "font-bold" : ""}`}>
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
            ? `${
                notifications.find(
                  (noti: any) => noti.id == currentNotification
                )?.title
              }`
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
