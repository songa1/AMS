import NewProfile from "@/components/Dashboard/AddNewUserPage";
import TopTitle from "@/components/Dashboard/TopTitle";

function page() {
  return (
    <div>
      <TopTitle title="Add New User" />
      <NewProfile/>
    </div>
  );
}

export default page;
