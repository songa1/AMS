import IndividualChatPage from "@/components/Dashboard/IndividualChatPage";
import TopTitle from "@/components/Other/TopTitle";

async function page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  console.log(username);
  return (
    <div>
      <TopTitle title="Messages" />
      <IndividualChatPage username={username} />
    </div>
  );
}

export default page;
