import { OnlyAdmin } from "@/components/Other/AccessDashboard";
import NewProfile from "@/components/Dashboard/AddNewUserPage";

function page() {
  return (
    <div>
      <OnlyAdmin>
        <NewProfile />
      </OnlyAdmin>
    </div>
  );
}

export default page;
