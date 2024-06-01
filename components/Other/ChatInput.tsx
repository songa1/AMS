"use client";

import React from "react";

function ChatInput() {
  return (
    <div className="relative flex h-10 w-full min-w-[200px]">
      <button
        className="!absolute right-1 top-1 z-10 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
        type="button"
        data-ripple-light="true"
      >
        Send
      </button>
      <input
        type="email"
        className="h-full w-full rounded-md border border-mainBlue bg-transparent px-3 py-2.5 pr-20 text-sm font-normal outline-0 transition-all"
        placeholder="Enter your message"
        required
      />
    </div>
  );
}

export default ChatInput;
