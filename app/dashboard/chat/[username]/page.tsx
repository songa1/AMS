import IndividualChatPage from "@/components/DashboardPages/IndividualChatPage";

async function page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  console.log(username);
  return (
    <div>
      <IndividualChatPage username={username} />
    </div>
  );
}

export default page;
