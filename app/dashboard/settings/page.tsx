import DataNeededPage from "@/components/Dashboard/DataNeededPage";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";
import TopTitle from "@/components/Other/TopTitle";

function page() {
  return (
    <div>
      <TopTitle title="Settings" />
      <OnlyAdmin>
        <DataNeededPage />
      </OnlyAdmin>
    </div>
  );
}

export default page;
