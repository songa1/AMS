import dynamic from "next/dynamic";

const NewProfile = dynamic(
  () => import("@/components/Dashboard/AddNewUserPage"),
  { ssr: false }
);
import { OnlyAdmin } from "@/components/Other/AccessDashboard";

function page() {
  return (
    <div>
      <OnlyAdmin>
        <NewProfile />
      </OnlyAdmin>
    </div>
  );
}

export default page;
