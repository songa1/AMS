import Notifications from "@/components/DashboardPages/Notifications";
import Button from "@/components/ui/Button";
import Link from "next/link";

function page() {
  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <div></div>
        <Link href={"/dashboard/settings"}>
          <Button title="Setup" onClick={null} />
        </Link>
      </div>
      <Notifications />
    </div>
  );
}

export default page;
