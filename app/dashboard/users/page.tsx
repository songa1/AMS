"use client";

import ProfilePage from "@/components/Dashboard/ProfilePage";
import TopTitle from "@/components/Dashboard/TopTitle";
import UsersPage from "@/components/Dashboard/userspage";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="Users" />
      <UsersPage />
    </div>
  );
}

export default page;