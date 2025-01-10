import ProfilePage from "@/components/Dashboard/Members/ProfilePage";
import TopTitle from "@/components/Other/TopTitle";

function page() {
  return (
    <div>
      <TopTitle title="My Profile" />
      <ProfilePage />
    </div>
  );
}

export default page;
