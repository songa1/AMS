import DashboardHome from "@/components/Dashboard/DashboardHome";
import TopTitle from "@/components/Other/TopTitle";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";

function page() {
  return (
    <div>
      <OnlyAdmin>
        <DashboardHome />
      </OnlyAdmin>
    </div>
  );
}

export default page;
