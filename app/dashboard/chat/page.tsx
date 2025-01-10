import TopTitle from "@/components/Other/TopTitle";
import dynamic from "next/dynamic";
const IndividualChatPage = dynamic(
  () => import("@/components/Dashboard/Communications/IndividualChatPage"),
  { ssr: false }
);

function page() {
  return (
    <div>
      <TopTitle title="AMS Community Chat" />
      <IndividualChatPage />
    </div>
  );
}

export default page;
