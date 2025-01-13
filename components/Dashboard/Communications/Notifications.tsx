"use client";

import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useNotificationsQuery,
  useOpenNotificationMutation,
} from "@/lib/features/notificationSlice";
import { getUser } from "@/helpers/auth";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { SectionTitle } from "@/components/Other/TopTitle";
import Loading from "@/app/loading";

function Notifications() {
  dayjs.extend(relativeTime);
  const [notifications, setNotifications] = useState<any>([]);
  const [currentNotification, setCurrentNotification] = useState<string>();
  const [notification, setNotification] = useState<string | null>();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    await openNotification({ id: id });
    refetch();
    setCurrentNotification(id);
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box className="notifications">
      <Box className="notifications-left">
        <SectionTitle title="Inbox" />
        <List
          className="flex flex-col gap-1"
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Choose a notification to view
            </ListSubheader>
          }
        >
          {notifications ? (
            [...notifications]
              .sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((noti: any, index: number) => (
                <ListItemButton
                  key={index + 1}
                  selected={openNotification == noti?.id}
                  onClick={() => handleOpenNotification(noti?.id)}
                >
                  <ListItemText
                    sx={{ fontWeight: !noti?.opened ? 600 : 100 }}
                    primary={noti.title}
                    secondary={dayjs(noti?.createdAt).fromNow()}
                  />
                </ListItemButton>
              ))
          ) : (
            <Typography
              variant="body2"
              className="py-4 px-2 text-center text-xs"
            >
              No Notifications for Now! Check back later!
            </Typography>
          )}
        </List>
      </Box>
      <Box className="notifications-right">
        <SectionTitle
          title={
            currentNotification
              ? `${
                  notifications.find(
                    (noti: any) => noti.id == currentNotification
                  )?.title
                }`
              : "No notification selected!"
          }
        />
        {currentNotification && notification && (
          <Typography
            className="p-5 flex flex-col gap-5 notification"
            variant="body2"
            dangerouslySetInnerHTML={{
              __html: notification,
            }}
          ></Typography>
        )}
      </Box>
    </Box>
  );
}

export default Notifications;
