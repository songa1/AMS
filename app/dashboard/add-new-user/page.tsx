import dynamic from "next/dynamic";

const NewProfile = dynamic(
  () => import("@/components/Dashboard/Members/AddMember/AddNewUserPage"),
  { ssr: false }
);
import { OnlyAdmin } from "@/components/Other/AccessDashboard";
import TopTitle from "@/components/Other/TopTitle";

function page() {
  return (
    <div>
      <TopTitle title="Add New Member" />
      <OnlyAdmin>
        <NewProfile />
      </OnlyAdmin>
    </div>
  );
}

export default page;
