import { OnlyAdmin } from "@/components/Other/AccessDashboard";
import NewProfile from "@/components/Dashboard/AddNewUserPage";
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
