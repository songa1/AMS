import dynamic from "next/dynamic";
const ChangePasswordPage = dynamic(
  () => import("@/components/Dashboard/ResetPassword"),
  { ssr: false }
);

function page() {
  return (
    <div>
      <ChangePasswordPage />
    </div>
  );
}

export default page;
