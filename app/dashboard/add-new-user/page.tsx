import dynamic from "next/dynamic";

const NewProfile = dynamic(
  () => import("@/components/Dashboard/AddNewUserPage"),
  { ssr: false }
);
import TopTitle from "@/components/Other/TopTitle";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";

function page() {
  return (
    <div>
      <TopTitle title="Add New User" />
      <OnlyAdmin>
        <NewProfile />
      </OnlyAdmin>
    </div>
  );
}

export default page;
