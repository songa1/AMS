"use client";

import DashboardHome from "@/components/Dashboard/DashboardHome";
import TopTitle from "@/components/Dashboard/TopTitle";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="Dashboard" />
      <DashboardHome />
    </div>
  );
}

export default page;
