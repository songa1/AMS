import Notifications from "@/components/Dashboard/Communications/Notifications";
import TopTitle from "@/components/Other/TopTitle";

function page() {
  return (
    <div>
      <TopTitle title="Notifications" />
      <div className="flex items-center justify-between pb-2"></div>
      <Notifications />
    </div>
  );
}

export default page;
