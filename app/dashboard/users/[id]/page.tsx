"use client";

import TopTitle from "@/components/Dashboard/TopTitle";
import GetUser from "@/components/Dashboard/getOneUserPage";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="One User" />
      <GetUser />
    </div>
  );
}

export default page;