import TopTitle from "@/components/Other/TopTitle";
import dynamic from "next/dynamic";
const ChangePasswordPage = dynamic(
  () => import("@/components/Dashboard/ResetPassword"),
  { ssr: false }
);

function page() {
  return (
    <div>
      <TopTitle title="Change Password" />
      <ChangePasswordPage />
    </div>
  );
}

export default page;
