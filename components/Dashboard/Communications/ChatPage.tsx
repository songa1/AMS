"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatInput from "../../Other/ChatInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useAddMessageMutation,
  useChatsQuery,
  usePrivateMessagesQuery,
} from "@/lib/features/chatSlice";
import { Message } from "@/types/message";
import { getUser } from "@/helpers/auth";
import { useUsersQuery } from "@/lib/features/userSlice";
import { User } from "@/types/user";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams } from "next/navigation";
import { Avatar, Box, Typography } from "@mui/material";

function ChatPage() {
  const user: User = getUser();
  dayjs.extend(relativeTime);
  const [messages, setMessages] = useState<Message[]>([]);
  const { username } = useParams();

  const { data: chatsData } = useChatsQuery(user?.id, {
    skip: !!username,
    pollingInterval: 500,
  });

  const { data: privateChatsData } = usePrivateMessagesQuery(
    { id: username, oid: user?.id },
    {
      skip: !username,
      pollingInterval: 500,
    }
  );

  const [addMessage] = useAddMessageMutation();
  const { data: UsersQuery } = useUsersQuery("");

  useEffect(() => {
    if (chatsData && !username) {
      setMessages(chatsData?.data);
    }
  }, [chatsData, username]);

  useEffect(() => {
    if (privateChatsData && username) {
      setMessages(privateChatsData?.data);
    }
  }, [privateChatsData, username]);

  const messagesEndRef: any = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formik = useFormik({
    initialValues: {
      message: "",
      senderId: user?.id,
      receiverId: username ? username : "",
    },
    validationSchema: Yup.object({
      message: Yup.string().required("Message is required"),
      sender: Yup.string(),
      receiverId: Yup.string(),
    }),
    onSubmit: async (values: any) => {
      try {
        const res = await addMessage({ data: values }).unwrap();
        formik.resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Box className="chat">
      <Box
        className="left-0 right-0 top-0 p-4 rounded-t-xl flex items-center gap-3 dark:text-black"
        sx={{ backgroundColor: "white" }}
        style={{ zIndex: 1 }}
      >
        <Avatar
          alt={
            username
              ? UsersQuery?.data.find((user: User) => user?.id == username)
                  ?.firstName
              : "Community Chat"
          }
          src={
            username
              ? UsersQuery?.data.find((user: User) => user?.id == username)
                  ?.profileImage?.link
              : ""
          }
        />
        <Box className="flex flex-col">
          <Typography variant="h6" fontWeight={600}>
            {username
              ? UsersQuery?.data.find((user: User) => user?.id == username)
                  ?.firstName
              : "Community Chat"}
          </Typography>
          <Typography className="text-xs">
            {!username &&
              UsersQuery?.data.slice(0, 1).map((user: User) => user?.firstName)}
            {!username &&
              UsersQuery?.data.length > 2 &&
              " and " + (UsersQuery?.data.length - 1) + " others"}
          </Typography>
        </Box>
      </Box>
      <Box
        className={`h-[70vh] p-2 rounded-xl w-full content-end overflow-scroll my-scrollable-div no-scrollbar`}
      >
        {messages &&
          [...messages]
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((message) => {
              const otherPerson =
                user?.id !== message?.sender?.id
                  ? message?.sender
                  : message?.receiver;
              return (
                <Box
                  key={message?.id}
                  className={`flex flex-1 gap-1 w-full ${
                    message?.senderId === user?.id
                      ? "sentContainer"
                      : "receivedContainer"
                  }`}
                >
                  <Avatar
                    alt={otherPerson?.firstName}
                    src={username && otherPerson?.profileImage?.link}
                  />
                  <Box
                    className={`message ${
                      message?.senderId === user?.id ? "sent" : "received"
                    }`}
                  >
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    >
                      {message?.sender?.firstName +
                        " " +
                        message?.sender?.middleName || ""}
                    </Typography>
                    <Typography variant="subtitle1">
                      {message?.message}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {dayjs(message?.createdAt).fromNow()}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
        {messages && messages.length === 0 && (
          <Typography variant="body2" className="items-center">
            No messages yet, send a message to start the conversation!
          </Typography>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <form className="flex gap-2 items-center">
        <ChatInput
          onSubmit={() => formik.handleSubmit()}
          value={formik.values.message}
          setValue={(e: any) => {
            formik.setFieldValue("message", e.target.value);
            formik.setFieldValue("receiverId", username ? username : "");
          }}
        />
      </form>
    </Box>
  );
}

export default ChatPage;
