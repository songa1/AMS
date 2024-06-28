import TopTitle from "@/components/Dashboard/TopTitle";
import UsersPage from "@/components/Dashboard/userspage";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";

function page() {
  return (
    <div>
      <TopTitle title="Users" />
      <OnlyAdmin>
        <UsersPage />
      </OnlyAdmin>
    </div>
  );
}

export default page;
