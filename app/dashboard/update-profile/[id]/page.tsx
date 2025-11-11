import TopTitle from "@/components/Other/TopTitle";
import UpdateProfile from "@/components/Dashboard/UpdateProfilepage";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log(id);
  return (
    <div>
      <TopTitle title=" UpdateUser" />
      <OnlyAdmin>
        <UpdateProfile />
      </OnlyAdmin>
    </div>
  );
}

export default page;
