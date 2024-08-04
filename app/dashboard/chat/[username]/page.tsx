import IndividualChatPage from "@/components/Dashboard/IndividualChatPage";
import TopTitle from "@/components/Other/TopTitle";

function page() {
  return (
    <div>
      <TopTitle title="Messages" />
      <IndividualChatPage />
    </div>
  );
}

export default page;
