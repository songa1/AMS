"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { User } from "@/types/user";

import Loading from "@/app/loading";
import { getUser } from "@/helpers/auth";
import DisplayField from "../Other/DisplayField";
import Link from "next/link";

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
        <label>District:</label>
        <DisplayField text={user?.residentDistrict?.name} />
      </div>
      <div className="field">
        <label>Sector:</label>
        <DisplayField text={user?.residentSector?.name} />
      </div>
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
        <DisplayField text={user?.track ? user?.track : ""} />
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
      <DisplayField text={user?.organizationFounded?.workingSector} />
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
      <label>District:</label>
      <DisplayField text={user?.organizationFounded?.district?.name} />
    </div>
    <div className="field">
      <label>Sector:</label>
      <DisplayField text={user?.organizationFounded?.sector?.name} />
    </div>
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
      <DisplayField text={user?.organizationEmployed?.workingSector} />
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
      <label>District:</label>
      <DisplayField text={user?.organizationEmployed?.district?.name} />
    </div>
    <div className="field">
      <label>Sector:</label>
      <DisplayField text={user?.organizationEmployed?.district?.name} />
    </div>
  </div>
);

function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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

  if (isLoading && !user) {
    return <Loading />;
  }

  return (
    <div className="">
      <div className="w-full">
        <img
          src="/kigali.jpg"
          className="w-full h-40 object-cover rounded-t-xl"
        />
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
        <div className="relative">
          <div className="flex items-center justify-between p-2 py-2">
            <h2 className="font-bold text-2xl">
              {user?.firstName && user?.middleName && user?.lastName
                ? user?.firstName +
                  " " +
                  user?.middleName +
                  " " +
                  user?.lastName
                : ""}
            </h2>
            <Link href="update-profile">
              <button className="right-1 top-1 z-10 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md">
                Update Profile
              </button>
            </Link>
          </div>
        </div>
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