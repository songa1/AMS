"use client";

import React, { useEffect, useState } from "react";
import ChatPage from "./ChatPage";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { usePrivateChatsQuery } from "@/lib/features/chatSlice";
import { getUser } from "@/helpers/auth";
import { Message } from "@/types/message";
import {
  Avatar,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { SectionTitle } from "@/components/Other/TopTitle";
import PeopleIcon from "@mui/icons-material/People";

function IndividualChatPage() {
  dayjs.extend(relativeTime);
  const user = getUser();
  const [chats, setChats] = useState<Message[]>([]);

  const { data } = usePrivateChatsQuery(user?.id);

  useEffect(() => {
    if (data) {
      const chatMap = new Map();

      const sortedChats = [...data?.data].sort(
        (a: Message, b: Message) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      sortedChats.forEach((chat: Message) => {
        const otherUserId =
          chat.senderId === user.id ? chat.receiverId : chat.senderId;
        if (!chatMap.has(otherUserId)) {
          chatMap.set(otherUserId, chat);
        }
      });

      setChats(Array.from(chatMap.values()));
    }
  }, [data, user.id]);

  return (
    <Box className="grid grid-cols-4 gap-2">
      <Box>
        <Box className="notifications-left p-2">
          <SectionTitle title="Inbox" />
          <List
            className="flex flex-col gap-1"
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
          >
            <ListItemButton
              onClick={() => (globalThis.location.href = "/dashboard/chat")}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Community Chat" />
            </ListItemButton>
            {chats.length > 0 ? (
              [...chats]
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((noti: Message, index: number) => (
                  <ListItemButton
                    key={index + 1}
                    className="border-b border-gray-200 p-2 px-4 cursor-pointer hover:bg-blue-100"
                    onClick={() =>
                      (globalThis.location.href = `/dashboard/chat/${noti?.id}`)
                    }
                  >
                    <ListItemIcon>
                      <Avatar
                        alt={
                          noti?.receiver?.id !== user?.id
                            ? noti?.receiver?.firstName
                            : noti?.sender?.firstName
                        }
                        src={
                          noti?.receiver?.id !== user?.id
                            ? noti?.receiver?.profileImage?.link
                            : noti?.sender?.profileImage?.link
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${noti?.receiver?.firstName} ${
                        noti?.receiver?.id == user?.id ? "(You)" : ""
                      }`}
                      secondary={dayjs(noti?.createdAt).fromNow()}
                    ></ListItemText>
                  </ListItemButton>
                ))
            ) : (
              <Typography
                variant="body2"
                className="py-4 px-2 text-center text-xs"
              >
                No private chats for Now! Start a conversation!
              </Typography>
            )}
          </List>
        </Box>
      </Box>
      <Box className="col-span-3">
        <ChatPage />
      </Box>
    </Box>
  );
}

export default IndividualChatPage;
