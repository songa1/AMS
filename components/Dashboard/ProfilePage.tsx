"use client";

import { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import {
  useChangeMutation,
  useGetOneUserQuery,
} from "@/lib/features/userSlice";
import { User } from "@/types/user";
import { getUser } from "@/helpers/auth";
import { Personal } from "../parts/ProfilePagePersonal";
import { Founded } from "../parts/ProfilePageFounded";
import { Employment } from "../parts/ProfilePageEmployment";
import Loading from "@/app/loading";
import ConfirmModal from "../Other/confirmModal";
import { ToastNotification } from "../ui/toast";
import { CustomChip } from "../ui/chip";
import Link from "next/link";
import { CustomButton } from "../ui/button1";

function ProfilePage() {
  dayjs.extend(relativeTime);
  const { id } = useParams();

  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    detail: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [roleModal, setRoleModal] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Rename to differentiate from RTK hook's loading
  const [isDataLoading, setIsDataLoading] = useState(true);

  const userProfile = useGetOneUserQuery((id as string) || userData?.id);
  const [change] = useChangeMutation();
  const user: User = userProfile?.data;

  const authUser: User | null = getUser();
  const isAdmin = authUser?.role?.name === "ADMIN";

  const handleCloseToast = () => setToastMessage(null);

  useEffect(() => {
    setIsDataLoading(true);
    const data = getUser();
    setUserData(data);
    setIsDataLoading(false);
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const tabs = [
    {
      label: "Personal",
      content: <Personal user={user} />,
    },
    {
      label: "Your Initiative",
      content: <Founded user={user} />,
    },
    {
      label: "Employment",
      content: <Employment user={user} />,
    },
  ];

  if (isDataLoading || userProfile.isLoading || !user) {
    return <Loading />;
  }

  const handleChangeRole = async () => {
    if (isAdmin) {
      setRoleModal(true);
    } else {
      setToastMessage({
        type: "error",
        detail: "You can not change user's role. Contact ADMIN!",
      });
    }
  };

  const changeRole = async () => {
    setLoading(true);
    try {
      const targetId = (id as string) || authUser?.id;
      if (!targetId) throw new Error("User ID not found for role change.");

      await change(targetId).unwrap();

      setToastMessage({
        type: "success",
        detail: "You have changed the user's role.",
      });
      // Optionally refetch user data to update the UI immediately
      userProfile.refetch();
    } catch (error: any) {
      console.error("Change role error:", error);
      setToastMessage({
        type: "error",
        detail: error?.data?.message || "Failed to change user's role.",
      });
    } finally {
      setLoading(false);
      setRoleModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <ToastNotification
        type={toastMessage?.type || "success"}
        message={toastMessage?.detail || ""}
        onClose={handleCloseToast}
      />

      {roleModal && (
        <ConfirmModal
          cancelText="Cancel"
          confirmText={loading ? "Changing..." : "Change"}
          title="Changing a user's role"
          description="Are you sure you want to change the user's role? Note that if the user was the ADMIN, the user will become a normal USER, and vice-versa."
          closeModal={() => setRoleModal(false)}
          action={changeRole}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-6 items-center border-b pb-6 mb-6">
        <img
          src={user?.profileImage?.link || "/placeholder.svg"}
          alt={`${user?.firstName}'s profile`}
          className="w-32 h-32 object-cover rounded-full shadow-md border-4 border-gray-100"
        />
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h2 className="font-extrabold text-3xl text-gray-900">
            {user
              ? `${user?.firstName || ""} ${user?.middleName || ""} ${
                  user?.lastName || ""
                }`
              : "User"}
            <span className="ml-3">
              <CustomChip
                onClick={handleChangeRole}
                label={user?.role?.name || "USER"}
                color={user?.role?.name === "ADMIN" ? "primary" : "secondary"}
              />
            </span>
          </h2>
          <p className="text-gray-700 italic">
            {user?.bio || "No biography provided."}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Profile created at **{dayjs(user?.createdAt).format("DD MMM YYYY")}
            **, Last updated **{dayjs(user?.updatedAt).fromNow()}**
          </p>
          <Link
            href={`/dashboard/update-profile/${isAdmin && id ? id : ""}`}
            className="mt-3"
          >
            <CustomButton onClick={(e) => console.log("clicked")}>Update Profile</CustomButton>
          </Link>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="p-0">
        <div className="border-b border-gray-200">
          <ul className="flex items-center gap-4 text-sm font-medium">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className="flex-1"
                onClick={() => handleTabClick(index)}
              >
                <button
                  type="button"
                  className={`relative block w-full px-1 py-3 text-center transition-colors duration-200 ease-in-out ${
                    index === activeTab
                      ? "text-indigo-600 border-b-2 border-indigo-600 font-bold"
                      : "text-gray-500 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-200"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          {tabs[activeTab].content}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
