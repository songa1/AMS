"use react";

import { Avatar } from "primereact/avatar";
import React, { useEffect, useRef, useState } from "react";
import { BiUser } from "react-icons/bi";
import ChatInput from "../Other/ChatInput";
import { useFormik } from "formik";
import * as Yup from "yup";

function ChatPage() {
  const user = {
    id: 1,
    username: "Sophie",
    status: "Online",
    picture:
      "https://static1.mujerhoy.com/www/multimedia/202303/02/media/mira-murati/mira-murati-captura.jpeg",
  };

  const otherUser = {
    id: 1,
    username: "Achille",
    status: "Online",
    picture:
      "https://static.wikia.nocookie.net/silicon-valley/images/3/33/Richard_Hendricks.jpg",
  };

  const [messages, setMessages] = useState([
    { id: 1, sender: "Achille", receiver: "Sophie", message: "Hi!" },
    { id: 2, sender: "Achille", receiver: "Sophie", message: "How are you?" },
    {
      id: 3,
      sender: "Sophie",
      receiver: "Achille",
      message: "I am good. How are you?",
    },
    {
      id: 4,
      sender: "Achille",
      receiver: "Sophie",
      message: "Can I borrow you laptop?",
    },
  ]);

  const messagesEndRef: any = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formik = useFormik({
    initialValues: {
      id: Date.now(),
      message: "",
      sender: user?.username,
      receiver: otherUser?.username,
    },
    validationSchema: Yup.object({
      message: Yup.string().required("Message is required"),
      sender: Yup.string(),
      receiver: Yup.string(),
    }),
    onSubmit: (values) => {
      try {
        setMessages((prev) => [...prev, values]);
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
          <h2 className="font-bold text-mainBlue">Community Chat</h2>
          <p className="text-xs">
            {user?.username}, {otherUser?.username} + 100 others
          </p>
        </div>
      </div>
      <div
        className={`h-[70vh] p-2 rounded-xl w-full content-end overflow-scroll my-scrollable-div no-scrollbar`}
      >
        {messages &&
          messages.map((message) => {
            return (
              <div
                key={message?.id}
                className={`flex flex-1 gap-1 w-full ${
                  message?.sender === user?.username
                    ? "sentContainer"
                    : "receivedContainer"
                }`}
              >
                <Avatar
                  icon={<BiUser />}
                  image={
                    message?.sender === user?.username
                      ? user?.picture
                      : otherUser?.picture
                  }
                />
                <div
                  className={`message ${
                    message?.sender === user?.username ? "sent" : "received"
                  }`}
                >
                  <p className="text-xs font-bold">{message?.sender}</p>
                  <p>{message?.message}</p>
                </div>
              </div>
            );
          })}
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
