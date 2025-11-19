import DataNeededPage from "@/components/DashboardPages/DataNeededPage";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";

function page() {
  return (
    <div>
      <OnlyAdmin>
        <DataNeededPage />
      </OnlyAdmin>
    </div>
  );
}

export default page;
