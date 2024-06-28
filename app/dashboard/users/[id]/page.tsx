"use client";

import TopTitle from "@/components/Dashboard/TopTitle";
import GetUser from "@/components/Dashboard/getOneUserPage";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="One User" />
      <OnlyAdmin>
        <GetUser />
      </OnlyAdmin>
    </div>
  );
}

export default page;
