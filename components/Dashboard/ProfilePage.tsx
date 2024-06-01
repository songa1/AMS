"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import React, { useState } from "react";

function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const Personal = () => (
    <div className="grid grid-cols-2 gap-3">
      <Panel header="Email">
        <p className="m-0">sophiemukamugema@gmail.com</p>
      </Panel>
      <Panel header="Phone Number">
        <p className="m-0">+250789635342</p>
      </Panel>
      <Panel header="Gender">
        <p className="m-0">Female</p>
      </Panel>
      <Panel header="Birth Date">
        <p className="m-0">1973-02-27</p>
      </Panel>
      <Panel header="Language">
        <p className="m-0">English, Kinyarwanda</p>
      </Panel>
      <Panel header="Location">
        <p className="m-0">Kigali, Rwanda</p>
      </Panel>
    </div>
  );

  const Education = () => (
    <div className="grid grid-cols-2 gap-3">
      <Panel header="Email">
        <p className="m-0">sophiemukamugema@gmail.com</p>
      </Panel>
      <Panel header="Phone Number">
        <p className="m-0">+250789635342</p>
      </Panel>
      <Panel header="Gender">
        <p className="m-0">Female</p>
      </Panel>
      <Panel header="Birth Date">
        <p className="m-0">1973-02-27</p>
      </Panel>
      <Panel header="Language">
        <p className="m-0">English, Kinyarwanda</p>
      </Panel>
      <Panel header="Location">
        <p className="m-0">Kigali, Rwanda</p>
      </Panel>
    </div>
  );

  const Work = () => (
    <div className="grid grid-cols-2 gap-3">
      <Panel header="Email">
        <p className="m-0">sophiemukamugema@gmail.com</p>
      </Panel>
      <Panel header="Phone Number">
        <p className="m-0">+250789635342</p>
      </Panel>
      <Panel header="Gender">
        <p className="m-0">Female</p>
      </Panel>
      <Panel header="Birth Date">
        <p className="m-0">1973-02-27</p>
      </Panel>
      <Panel header="Language">
        <p className="m-0">English, Kinyarwanda</p>
      </Panel>
      <Panel header="Location">
        <p className="m-0">Kigali, Rwanda</p>
      </Panel>
    </div>
  );

  const tabs = [
    { label: "Personal", content: <Personal /> },
    { label: "Education", content: <Education /> },
    { label: "Work", content: <Work /> },
  ];
  return (
    <div className="">
      <div className="w-full">
        <img
          src="/kigali.jpg"
          className="w-full h-40 object-cover rounded-t-xl"
        />
        <div className="relative">
          <div className="p-5 absolute top-[-50px]">
            <Avatar
              shape="circle"
              image="/profile.jpg"
              label="S"
              size="xlarge"
            />
          </div>
          <div className="ml-[100px] flex justify-between items-center p-2">
            <div>
              <h1 className="flex items-center gap-1 font-bold text-xl">
                Mukamugema Sophie
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                label="Edit Profile"
                className="bg-mainBlue text-white px-5"
                rounded
                onClick={() => router.push("/dashboard/update-profile")}
              />
            </div>
          </div>
        </div>
        <div className="p-5 text-justify">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis
            error quasi velit amet quam eveniet impedit nulla! Blanditiis
            deserunt corporis neque debitis saepe ratione totam quis
            necessitatibus! Hic aspernatur repudiandae qui dicta perferendis
            aliquid, nobis sequi suscipit enim distinctio odio sit dolore? Nihil
            sint praesentium labore vero dolor magnam corrupti!
          </p>
          <div className="my-5">
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
