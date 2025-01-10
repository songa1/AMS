import TopTitle from "@/components/Other/TopTitle";
import React from "react";
import UpdateEmployedInfo from "@/components/Dashboard/Members/UpdateMember/AddEmployedInfo";

function page() {
  return (
    <div>
      <TopTitle title="Update Employment Info" />
      <UpdateEmployedInfo />
    </div>
  );
}

export default page;
