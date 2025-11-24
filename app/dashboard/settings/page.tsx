import SettingsPage from "@/components/DashboardPages/SettingsPage";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";

function page() {
  return (
    <div>
      <OnlyAdmin>
        <SettingsPage />
      </OnlyAdmin>
    </div>
  );
}

export default page;
