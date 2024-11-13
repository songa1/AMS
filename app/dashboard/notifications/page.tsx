import Notifications from "@/components/Dashboard/Notifications";
import Button from "@/components/Other/Button";
import TopTitle from "@/components/Other/TopTitle";
import Link from "next/link";

function page() {
  return (
    <div>
      <TopTitle title="Notifications" />
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
