"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  useAddMessageMutation,
  useChatsQuery,
  usePrivateMessagesQuery,
} from "@/lib/features/chatSlice";
import { Message } from "@/types/message";
import { getUser } from "@/helpers/auth";
import { useUsersQuery } from "@/lib/features/userSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams } from "next/navigation";
import { ChatInput, CustomAvatar } from "../parts/ChatInput";
import { Member } from "@/types/user";


function ChatPage() {
  const user = getUser();
  dayjs.extend(relativeTime);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState(""); // New state for input field
  const { username } = useParams();

  // RTK Queries
  const { data: chatsData } = useChatsQuery("", {
    skip: !!username,
    pollingInterval: 500,
  });

  const { data: privateChatsData } = usePrivateMessagesQuery(
    { id: username as string, oid: user?.id as string },
    {
      skip: !username,
      pollingInterval: 500,
    }
  );

  const [addMessage] = useAddMessageMutation();
  const { data: usersQuery } = useUsersQuery("");

  // Update messages state based on query data
  useEffect(() => {
    if (chatsData && !username) {
      setMessages(chatsData?.data || []);
    }
  }, [chatsData, username]);

  useEffect(() => {
    if (privateChatsData && username) {
      setMessages(privateChatsData?.data || []);
    }
  }, [privateChatsData, username]);

  // Scroll to bottom logic
  const messagesEndRef: any = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Replaced Formik Logic with standard React State and Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();

    if (!trimmedMessage) return;

    const values = {
      message: trimmedMessage,
      senderId: user?.id,
      receiverId: username ? (username as string) : "",
    };

    try {
      // The API call structure based on your original code
      await addMessage({ data: values }).unwrap();
      setMessageInput(""); // Reset input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // --- End Formik Replacement ---

  // Get the recipient's name for private chat header
  const recipient = username
    ? usersQuery?.data.find((u: Member) => u?.id === username)
    : null;

  // Get chat header display info
  const headerTitle = username
    ? `${recipient?.firstName || "Unknown"} ${recipient?.lastName || ""}`
    : "Community Chat";

  const chatParticipants = usersQuery?.data
    ? usersQuery.data
        .slice(0, 2)
        .map((u: Member) => u.firstName)
        .join(", ")
    : "";
  const remainingCount = usersQuery?.data ? usersQuery.data.length - 2 : 0;
  const headerSubtitle = username
    ? "" // Private chat doesn't need this subtitle
    : `${chatParticipants}${remainingCount > 0 ? ` and ${remainingCount} others` : ""}`;

  return (
    <div className="flex flex-col h-full max-h-[90vh] bg-white rounded-xl shadow-lg">
      {/* Chat Header */}
      <div
        className="sticky top-0 bg-indigo-50 p-4 rounded-t-xl flex items-center gap-3 border-b border-indigo-100 shadow-sm"
        style={{ zIndex: 1 }}
      >
        <CustomAvatar
          image={recipient?.picture || ""} // Use recipient picture if available
          senderName={recipient?.firstName || ""}
        />
        <div className="flex flex-col">
          <h2 className="font-bold text-lg text-indigo-700">{headerTitle}</h2>
          <p className="text-xs text-gray-500">{headerSubtitle}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 p-4 overflow-y-scroll space-y-4 bg-gray-50 custom-scrollbar`}
        style={{ minHeight: "400px" }} // Added min-height for structure
      >
        {messages &&
          [...messages]
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((message) => {
              const isSent = message?.senderId === user?.id;
              const senderUser = usersQuery?.data.find(
                (u: Member) => u.id === message.senderId
              );
              const senderName = `${senderUser?.firstName || "Unknown"} ${
                senderUser?.middleName || ""
              }`;
              const senderImage = senderUser?.picture || "";

              return (
                <div
                  key={message?.id}
                  className={`flex gap-2 w-full ${
                    isSent ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Receiver's side (Avatar on left) */}
                  {!isSent && (
                    <CustomAvatar image={senderImage} senderName={senderName} />
                  )}

                  <div
                    className={`flex flex-col max-w-xs sm:max-w-md ${
                      isSent ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`py-2 px-4 rounded-xl shadow ${
                        isSent
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {!isSent && (
                        <p className="text-xs font-semibold mb-1 opacity-80">
                          {senderName}
                        </p>
                      )}
                      <p className="text-sm">{message?.message}</p>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isSent ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {dayjs(message?.createdAt).fromNow()}
                    </p>
                  </div>

                  {/* Sender's side (Avatar on right) */}
                  {isSent && (
                    <CustomAvatar image={senderImage} senderName={senderName} />
                  )}
                </div>
              );
            })}

        {messages && messages.length === 0 && (
          <div className="flex h-full w-full justify-center items-center text-gray-500 italic">
            No messages yet, send a message to start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
        <ChatInput
          handleSubmit={handleSubmit}
          value={messageInput}
          setValue={(e) => setMessageInput(e.target.value)}
        />
      </div>
    </div>
  );
}

export default ChatPage;
