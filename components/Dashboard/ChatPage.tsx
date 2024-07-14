"use client";

import { Avatar } from "primereact/avatar";
import React, { useEffect, useRef, useState } from "react";
import { BiUser } from "react-icons/bi";
import ChatInput from "../Other/ChatInput";
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

function ChatPage() {
  const user = getUser();
  dayjs.extend(relativeTime);
  // const [messages, setMessages] = useState<Message[]>([]);
  const { username } = useParams();

  const { data: chatsData } = useChatsQuery("", {
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

  // useEffect(() => {
  //   if (chatsData && !username) {
  //     setMessages(chatsData?.data);
  //   }
  // }, [chatsData, username]);

  // useEffect(() => {
  //   if (privateChatsData && username) {
  //     setMessages(privateChatsData?.data);
  //   }
  // }, [privateChatsData, username]);

  const messages = username ? privateChatsData?.data : chatsData?.data;

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
    }),
    onSubmit: async (values) => {
      try {
        const res = await addMessage({ data: values }).unwrap();
        formik.resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="chat">
      <div
        className="bg-gray-100 left-0 right-0 top-0 p-4 rounded-t-xl flex items-center gap-3"
        style={{ zIndex: 1 }}
      >
        <Avatar icon={<BiUser />} />
        <div className="flex flex-col">
          <h2 className="font-bold text-mainBlue">
            {username
              ? UsersQuery?.data.find((user: User) => user?.id == username)
                  ?.firstName
              : "Community Chat"}
          </h2>
          <p className="text-xs">
            {!username &&
              UsersQuery?.data
                .slice(0, 2)
                .map((user: User) => user?.firstName + ", ")}
            {!username &&
              UsersQuery?.data.length > 2 &&
              " and " + UsersQuery?.data.length + " others"}
          </p>
        </div>
      </div>
      <div
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
              return (
                <div
                  key={message?.id}
                  className={`flex flex-1 gap-1 w-full ${
                    message?.senderId === user?.id
                      ? "sentContainer"
                      : "receivedContainer"
                  }`}
                >
                  <Avatar
                    icon={<BiUser />}
                    image={message?.senderId === user?.id ? user?.picture : ""}
                  />
                  <div
                    className={`message ${
                      message?.senderId === user?.id ? "sent" : "received"
                    }`}
                  >
                    <p className="text-xs font-bold">
                      {message?.sender?.firstName +
                        " " +
                        message?.sender?.middleName || ""}
                    </p>
                    <p>{message?.message}</p>
                    <p className="text-xs text-gray-600">
                      {dayjs(message?.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              );
            })}
        {messages && messages.length === 0 && (
          <div className="flex h-full w-full justify-center items-center">
            No messages yet, send a message to start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex gap-2 items-center">
        <ChatInput
          onSubmit={() => formik.handleSubmit()}
          value={formik.values.message}
          setValue={(e: any) => formik.setFieldValue("message", e.target.value)}
        />
      </form>
    </div>
  );
}

export default ChatPage;
