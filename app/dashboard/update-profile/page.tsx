"use client";

import TopTitle from "@/components/Dashboard/TopTitle";
import UpdateProfile from "@/components/Dashboard/UpdateProfile";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="Update Profile" />
      <UpdateProfile />
    </div>
  );
}

export default page;
