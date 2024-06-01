"use react";

import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import React from "react";
import { BiUser } from "react-icons/bi";
import ChatInput from "../Other/ChatInput";

function ChatPage() {
  return (
    <div className="chat">
      <div
        className="bg-gray-100 left-0 right-0 top-0 p-4 rounded-t-xl flex items-center gap-3"
        style={{ zIndex: 1 }}
      >
        <Avatar icon={<BiUser />} />
        <div className="flex flex-col">
          <h2 className="font-bold text-mainBlue">Mukamugema Sophie</h2>
          <p className="text-xs">Online</p>
        </div>
      </div>
      <div
        className={`h-[70vh] p-2 rounded-xl w-full content-end overflow-scroll my-scrollable-div no-scrollbar`}
      >
        <div className={`flex flex-1 gap-1 w-full receivedContainer`}>
          <Avatar icon={<BiUser />} />
          <div className={`message received`}>
            <p className="text-xs font-bold">Sonia</p>
            <p>Lorem Ipsum doler</p>
          </div>
        </div>
        <div className={`flex flex-1 gap-1 w-full sentContainer`}>
          <Avatar icon={<BiUser />} />
          <div className={`message sent`}>
            <p className="text-xs font-bold">Iranzi</p>
            <p>Lorem Ipsum doler</p>
          </div>
        </div>
      </div>
      <form className="flex gap-2 items-center">
        <ChatInput />
      </form>
    </div>
  );
}

export default ChatPage;
