"use client";

import ProfilePage from "@/components/Dashboard/ProfilePage";
import TopTitle from "@/components/Dashboard/TopTitle";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="My Profile" />
      <ProfilePage />
    </div>
  );
}

export default page;
