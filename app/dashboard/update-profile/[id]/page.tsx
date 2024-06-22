"use client";

import TopTitle from "@/components/Dashboard/TopTitle";
import UpdateProfile from "@/components/Dashboard/UpdateProfilepage";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title=" UpdateUser" />
      <UpdateProfile/>
    </div>
  );
}

export default page;