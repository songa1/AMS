"use client";

import ProfilePage from "@/components/DashboardPages/ProfilePage";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";
import React from "react";

function page() {
  return (
    <div>
      <OnlyAdmin>
        <ProfilePage />
      </OnlyAdmin>
    </div>
  );
}

export default page;
