import { OnlyAdmin } from "@/components/Other/AccessDashboard";
import NewProfile from "@/components/DashboardPages/AddNewUserPage";

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
