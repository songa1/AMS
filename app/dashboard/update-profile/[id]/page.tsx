import UpdateProfile from "@/components/DashboardPages/UpdateProfilepage";
import { OnlyAdmin } from "@/components/Other/AccessDashboard";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log(id);
  return (
    <div>
      <OnlyAdmin>
        <UpdateProfile />
      </OnlyAdmin>
    </div>
  );
}

export default page;
