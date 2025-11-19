import DashboardHome from "@/components/DashboardPages/DashboardHome";
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
