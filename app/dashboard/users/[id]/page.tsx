import ProfilePage from "@/components/Dashboard/Members/ProfilePage";
import TopTitle from "@/components/Other/TopTitle";
import React from "react";

function page() {
  return (
    <div>
      <TopTitle title="Member Profile" />
      <ProfilePage />
    </div>
  );
}

export default page;
