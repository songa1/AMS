import ChangePasswordPage from "@/components/Dashboard/ResetPassword";
import TopTitle from "@/components/Dashboard/TopTitle";

function page() {
  return (
    <div>
      <TopTitle title="Change Password" />
      <ChangePasswordPage />
    </div>
  );
}

export default page;
