"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { User } from "@/types/user";

import Loading from "@/app/loading";
import { getUser } from "@/helpers/auth";
import DisplayField from "../Other/DisplayField";
import Link from "next/link";
import {
  useChangeMutation,
  useGetOneUserQuery,
} from "@/lib/features/userSlice";
import { Toast } from "primereact/toast";
import ConfirmModal from "../Other/confirmModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button, Chip } from "@mui/material";

const Personal = ({ user }: { user: User | null }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="field">
        <label>Email:</label>
        <DisplayField text={user?.email} />
      </div>
      <div className="field">
        <label>Phone Number:</label>
        <DisplayField text={user?.phoneNumber} />
      </div>
      <div className="field">
        <label>WhatsApp Number:</label>
        <DisplayField text={user?.whatsappNumber} />
      </div>
      <div className="field">
        <label>Gender:</label>
        <DisplayField text={user?.genderName} />
      </div>
      <div className="field">
        <label>Resident Country:</label>
        <DisplayField text={user?.residentCountry?.name} />
      </div>
      {user?.residentCountry && user?.residentCountry?.id === "rwanda" && (
        <div className="field">
          <label>Resident District:</label>
          <DisplayField text={user?.residentDistrict?.name} />
        </div>
      )}
      {user?.residentCountry && user?.residentCountry?.id === "rwanda" && (
        <div className="field">
          <label>Resident Sector:</label>
          <DisplayField text={user?.residentSector?.name} />
        </div>
      )}
      <div className="field">
        <label>Cohort:</label>
        <DisplayField text={user?.cohort?.name} />
      </div>
      <div className="field">
        <label>Nearest Landmark:</label>
        <DisplayField
          text={user?.nearestLandmark ? user?.nearestLandmark : ""}
        />
      </div>
      <div className="field">
        <label>Track:</label>
        <DisplayField text={user?.track ? user?.track?.name : ""} />
      </div>
      <div className="field">
        <label>Facebook Account:</label>
        <DisplayField text={user?.facebook ? user?.facebook : "--"} />
      </div>
      <div className="field">
        <label>Instagram Account:</label>
        <DisplayField text={user?.instagram ? user?.instagram : "--"} />
      </div>
      <div className="field">
        <label>LinkedIn Account:</label>
        <DisplayField text={user?.linkedin ? user?.linkedin : "--"} />
      </div>
      <div className="field">
        <label>Twitter Account:</label>
        <DisplayField text={user?.twitter ? user?.twitter : "--"} />
      </div>
    </div>
  );
};

const Founded = ({ user }: { user: User | null }) => (
  <div className="grid grid-cols-2 gap-3">
    <div className="field">
      <label>Your Initiative Name:</label>
      <DisplayField text={user?.organizationFounded?.name} />
    </div>
    <div className="field">
      <label>Main Sector:</label>
      <DisplayField text={user?.organizationFounded?.workingSector?.name} />
    </div>
    <div className="field">
      <label>Your Position:</label>
      <DisplayField
        text={user?.positionInFounded ? user?.positionInFounded : ""}
      />
    </div>
    <div className="field">
      <label>Website:</label>
      <DisplayField text={user?.organizationFounded?.website} />
    </div>
    <div className="field">
      <label>Country:</label>
      <DisplayField text={user?.organizationFounded?.district?.name} />
    </div>
    {user?.organizationFounded &&
      user?.organizationFounded?.country?.name == "rwanda" && (
        <div className="field">
          <label>District:</label>
          <DisplayField text={user?.organizationFounded?.district?.name} />
        </div>
      )}
    {user?.organizationFounded &&
      user?.organizationFounded?.country?.name == "rwanda" && (
        <div className="field">
          <label>Sector:</label>
          <DisplayField text={user?.organizationFounded?.sector?.name} />
        </div>
      )}
  </div>
);

const Employment = ({ user }: { user: User | null }) => (
  <div className="grid grid-cols-2 gap-3">
    <div className="field">
      <label>Company Name:</label>
      <DisplayField text={user?.organizationEmployed?.name} />
    </div>
    <div className="field">
      <label>Company Sector:</label>
      <DisplayField text={user?.organizationEmployed?.workingSector?.name} />
    </div>
    <div className="field">
      <label>Your Position:</label>
      <DisplayField text={user?.positionInEmployed || ""} />
    </div>
    <div className="field">
      <label>Website:</label>
      <DisplayField text={user?.organizationEmployed?.website} />
    </div>
    <div className="field">
      <label>Country:</label>
      <DisplayField text={user?.organizationEmployed?.country?.name} />
    </div>
    {user?.organizationEmployed &&
      user?.organizationEmployed?.country?.id == "rwanda" && (
        <div className="field">
          <label>District:</label>
          <DisplayField text={user?.organizationEmployed?.district?.name} />
        </div>
      )}
    {user?.organizationEmployed &&
      user?.organizationEmployed?.country?.name == "rwanda" && (
        <div className="field">
          <label>Sector:</label>
          <DisplayField text={user?.organizationEmployed?.district?.name} />
        </div>
      )}
  </div>
);

function ProfilePage() {
  dayjs.extend(relativeTime);
  const { id } = useParams();
  const toast: any = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roleModal, setRoleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const userProfile = useGetOneUserQuery(id || userData?.id);
  const [change] = useChangeMutation();
  const user: User = userProfile?.data;

  const getUserData = async () => {
    setIsLoading(true);
    const data = getUser();
    setUser(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getUserData();
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

  if (isLoading || !user) {
    return <Loading />;
  }

  const handleChangeRole = async () => {
    try {
      if (userData?.role?.name === "ADMIN") {
        setRoleModal(true);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Permission Issue",
          detail: "You can not change user's role. Contact ADMIN!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeRole = async () => {
    try {
      const res = await change(id || userData?.id).unwrap();
      toast.current.show({
        severity: "success",
        summary: "Change Role",
        detail: "You have changed the user's role.",
      });
    } catch (error: any) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
    }
  };

  const isAdmin = userData?.role?.name === "ADMIN";

  return (
    <div className="">
      <Toast ref={toast} />
      {roleModal && (
        <ConfirmModal
          cancelText="Cancel"
          confirmText={loading ? "Changing..." : "Change"}
          title="Changing a user's role"
          description="Are you sure you want to change the user's role a user? Note that if the user was the ADMIN, the user will become a normal USER, and if a user was a normal USER, the user will become an ADMIN."
          closeModal={() => setRoleModal(false)}
          action={changeRole}
        />
      )}
      <div className="w-full">
        <div className="flex gap-3 items-center">
          <img
            src={`${
              user?.profileImage?.link
                ? user?.profileImage?.link
                : "/placeholder.svg"
            }`}
            className="w-48 h-48 object-cover rounded-full"
          />
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-2xl">
              {user
                ? `${user?.firstName || ""} ${user?.middleName || ""} ${
                    user?.lastName || ""
                  }`
                : ""}
              &nbsp;
              <Chip
                onClick={handleChangeRole}
                label={user?.role?.name}
                color="primary"
                size="small"
                variant="outlined"
              />
            </h2>
            <p>{user?.bio}</p>
            <p className="text-gray-500 text-xs">
              Profile created at {dayjs(user?.createdAt).format("DD MMM YYYY")},
              Last updated {dayjs(user?.updatedAt).fromNow()}
            </p>
            <Link
              href={`${
                isAdmin
                  ? "/dashboard/update-profile/" + id
                  : "/dashboard/update-profile"
              }`}
            >
              <Button size="small" variant="contained">
                Update Profile
              </Button>
            </Link>
          </div>
        </div>
        {error && (
          <p className="bg-red-500 text-white rounded-md text-center p-2 w-full my-3">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-500 text-white rounded-md text-center p-2 w-full my-3">
            {success}
          </p>
        )}
        <div className="p-5 text-justify">
          <div className="my-2">
            <ul className="-mb-px flex items-center gap-4 text-sm font-medium">
              {tabs.map((tab, index) => (
                <li
                  key={index}
                  className={`flex-1 ${
                    index === activeTab
                      ? "border-b border-blue-700 cursor-pointer"
                      : "cursor-pointer"
                  }`}
                  onClick={() => handleTabClick(index)}
                >
                  <a
                    className={`relative flex items-center justify-center gap-2 px-1 py-3 text-gray-500 hover:text-blue-700 font-bold ${
                      index === activeTab ? "text-blue-700" : ""
                    }`}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4">{tabs[activeTab].content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
