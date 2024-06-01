"use client";

import NewUserPage from "@/components/Dashboard/AddNewUserPage";
import TopTitle from "@/components/Dashboard/TopTitle";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="A new user" />
      <NewUserPage/>
    </div>
  );
}

export default page;
