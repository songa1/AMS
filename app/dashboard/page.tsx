import DashboardHome from "@/components/Dashboard/DashboardHome";
import TopTitle from "@/components/Dashboard/TopTitle";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";

function page() {
  return (
    <div>
      <TopTitle title="Dashboard" />
      <OnlyAdmin>
        <DashboardHome />
      </OnlyAdmin>
    </div>
  );
}

export default page;
