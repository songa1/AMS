"use client";

import React, { useEffect, useState } from "react";
import ChatPage from "./ChatPage";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { usePrivateChatsQuery } from "@/lib/features/chatSlice";
import { getUser } from "@/helpers/auth";
import { Message } from "@/types/message";

function IndividualChatPage() {
  dayjs.extend(relativeTime);
  const router = useRouter();
  const user = getUser();
  const [chats, setChats] = useState<Message[]>([]);

  const { username } = useParams();

  const { data } = usePrivateChatsQuery(user?.id);

  console.log(data);

  useEffect(() => {
    if (data) {
      setChats(data?.data);
    }
  }, [data]);

  return (
    <div className="grid grid-cols-4 gap-2">
      <div>
        <div className="notifications-left p-2">
          <h1 className="noti-sticky-header">Inbox</h1>
          <ul className="flex flex-col gap-1">
            <li
              className="border-b border-gray-200 p-2 px-4 cursor-pointer hover:bg-blue-100"
              onClick={() => router.push("/dashboard/chat")}
            >
              <div>
                {/* <p className="text-xs text-mainBlue">
                  {dayjs(noti?.createdAt).fromNow()}
                </p> */}
                <p className="font-bold">Community Chat</p>
              </div>
            </li>
            {chats ? (
              [...chats]
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((noti: any, index: number) => (
                  <li
                    key={index + 1}
                    className="border-b border-gray-200 p-2 px-4 cursor-pointer hover:bg-blue-100"
                  >
                    <div>
                      <p className="text-xs text-mainBlue">
                        {dayjs(noti?.createdAt).fromNow()}
                      </p>
                      <p className="">{noti?.receiver?.firstName}</p>
                    </div>
                  </li>
                ))
            ) : (
              <p className="py-4 px-2 text-center text-xs">
                No private chats for Now! Start a conversation!
              </p>
            )}
          </ul>
        </div>
      </div>
      <div className="col-span-3">
        <ChatPage />
      </div>
    </div>
  );
}

export default IndividualChatPage;
