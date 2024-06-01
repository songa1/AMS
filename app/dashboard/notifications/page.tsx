"use client";

import Notifications from "@/components/Dashboard/Notifications";
import TopTitle from "@/components/Dashboard/TopTitle";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="Notifications" />
      <Notifications />
    </div>
  );
}

export default page;
