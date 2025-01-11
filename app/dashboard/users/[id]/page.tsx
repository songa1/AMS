import ProfilePage from "@/components/Dashboard/Members/ProfilePage";
import TopTitle from "@/components/Other/TopTitle";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="Member Profile" />
      <OnlyAdmin>
        <ProfilePage />
      </OnlyAdmin>
    </div>
  );
}

export default page;
