"use client";

import TopTitle from "@/components/Other/TopTitle";
import UpdateProfile from "@/components/Dashboard/Members/UpdateMember/UpdateProfilepage";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title=" UpdateUser" />
      <OnlyAdmin>
        <UpdateProfile />
      </OnlyAdmin>
    </div>
  );
}

export default page;
