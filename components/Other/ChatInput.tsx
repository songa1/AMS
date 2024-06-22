"use client";

import React from "react";

function ChatInput({
  value,
  setValue,
  onSubmit,
}: {
  value: string;
  setValue: any;
  onSubmit: any;
}) {
  return (
    <div className="relative flex h-10 w-full min-w-[200px]">
      <button
        className="!absolute right-1 top-1 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        Send
      </button>
      <input
        type="text"
        value={value}
        onChange={setValue}
        className="h-full w-full rounded-md border border-mainBlue bg-transparent px-3 py-2.5 pr-20 text-sm font-normal outline-0 transition-all"
        placeholder="Enter your message"
      />
    </div>
  );
}

export default ChatInput;
