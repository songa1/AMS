import NewProfile from "@/components/Dashboard/AddNewUserPage";
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
