"use client";

import ChatPage from "@/components/Dashboard/ChatPage";
import TopTitle from "@/components/Dashboard/TopTitle";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="AMS Community Chat" />
      <ChatPage />
    </div>
  );
}

export default page;
