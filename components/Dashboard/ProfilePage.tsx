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
        <DisplayField text={user?.residentDistrict.name} />
      </div>
      <div className="field">
        <label>Sector:</label>
        <DisplayField text={user?.residentSector.name} />
      </div>
      <div className="field">
        <label>Cohort:</label>
        <DisplayField text={user?.cohort.name} />
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
      <DisplayField text={user?.organizationFounded.name} />
    </div>
    <div className="field">
      <label>Main Sector:</label>
      <DisplayField text={user?.organizationFounded.workingSector} />
    </div>
    <div className="field">
      <label>Your Position:</label>
      <DisplayField
        text={user?.positionInFounded ? user.positionInFounded : ""}
      />
    </div>
    <div className="field">
      <label>Website:</label>
      <DisplayField text={user?.organizationFounded.website} />
    </div>
    <div className="field">
      <label>District:</label>
      <DisplayField text={user?.organizationFounded.district.name} />
    </div>
    <div className="field">
      <label>Sector:</label>
      <DisplayField text={user?.organizationFounded.sector.name} />
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
    const data = await getUser();
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

function setUsers(arg0: (prevUsers: any) => User[]) {
  throw new Error("Function not implemented.");
}
// "use client";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { Avatar } from "primereact/avatar";
// import { Button } from "primereact/button";
// import { Panel } from "primereact/panel";
// import React, { useState } from "react";

// function ProfilePage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState(0);

//   const handleTabClick = (index: number) => {
//     setActiveTab(index);
//   };

//   const Personal = () => (
//     <div className="grid grid-cols-2 gap-3">
//       <Panel header="Email">
//         <p className="m-0">sophiemukamugema@gmail.com</p>
//       </Panel>
//       <Panel header="Phone Number">
//         <p className="m-0">+250789635342</p>
//       </Panel>
//       <Panel header="Gender">
//         <p className="m-0">Female</p>
//       </Panel>
//       <Panel header="Birth Date">
//         <p className="m-0">1973-02-27</p>
//       </Panel>
//       <Panel header="Language">
//         <p className="m-0">English, Kinyarwanda</p>
//       </Panel>
//       <Panel header="Location">
//         <p className="m-0">Kigali, Rwanda</p>
//       </Panel>
//     </div>
//   );

//   const Education = () => (
//     <div className="grid grid-cols-2 gap-3">
//       <Panel header="Email">
//         <p className="m-0">sophiemukamugema@gmail.com</p>
//       </Panel>
//       <Panel header="Phone Number">
//         <p className="m-0">+250789635342</p>
//       </Panel>
//       <Panel header="Gender">
//         <p className="m-0">Female</p>
//       </Panel>
//       <Panel header="Birth Date">
//         <p className="m-0">1973-02-27</p>
//       </Panel>
//       <Panel header="Language">
//         <p className="m-0">English, Kinyarwanda</p>
//       </Panel>
//       <Panel header="Location">
//         <p className="m-0">Kigali, Rwanda</p>
//       </Panel>
//     </div>
//   );

//   const Work = () => (
//     <div className="grid grid-cols-2 gap-3">
//       <Panel header="Email">
//         <p className="m-0">sophiemukamugema@gmail.com</p>
//       </Panel>
//       <Panel header="Phone Number">
//         <p className="m-0">+250789635342</p>
//       </Panel>
//       <Panel header="Gender">
//         <p className="m-0">Female</p>
//       </Panel>
//       <Panel header="Birth Date">
//         <p className="m-0">1973-02-27</p>
//       </Panel>
//       <Panel header="Language">
//         <p className="m-0">English, Kinyarwanda</p>
//       </Panel>
//       <Panel header="Location">
//         <p className="m-0">Kigali, Rwanda</p>
//       </Panel>
//     </div>
//   );

//   const tabs = [
//     { label: "Personal", content: <Personal /> },
//     { label: "Education", content: <Education /> },
//     { label: "Work", content: <Work /> },
//   ];
//   return (
//     <div className="">
//       <div className="w-full">
//         <img
//           src="/kigali.jpg"
//           className="w-full h-40 object-cover rounded-t-xl"
//         />
//         <div className="relative">
//           <div className="p-5 absolute top-[-50px]">
//             <Avatar
//               shape="circle"
//               image="/profile.jpg"
//               label="S"
//               size="xlarge"
//             />
//           </div>
//           <div className="ml-[100px] flex justify-between items-center p-2">
//             <div>
//               <h1 className="flex items-center gap-1 font-bold text-xl">
//                 Mukamugema Sophie
//               </h1>
//             </div>
//             <div className="flex gap-2 items-center">
//               <Button
//                 label="Edit Profile"
//                 className="bg-mainBlue text-white px-5"
//                 rounded
//                 onClick={() => router.push("/dashboard/update-profile")}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="p-5 text-justify">
//           <p>
//             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis
//             error quasi velit amet quam eveniet impedit nulla! Blanditiis
//             deserunt corporis neque debitis saepe ratione totam quis
//             necessitatibus! Hic aspernatur repudiandae qui dicta perferendis
//             aliquid, nobis sequi suscipit enim distinctio odio sit dolore? Nihil
//             sint praesentium labore vero dolor magnam corrupti!
//           </p>
//           <div className="my-5">
//             <ul className="-mb-px flex items-center gap-4 text-sm font-medium">
//               {tabs.map((tab, index) => (
//                 <li
//                   key={index}
//                   className={`flex-1 ${
//                     index === activeTab
//                       ? "border-b border-blue-700 cursor-pointer"
//                       : "cursor-pointer"
//                   }`}
//                   onClick={() => handleTabClick(index)}
//                 >
//                   <a
//                     className={`relative flex items-center justify-center gap-2 px-1 py-3 text-gray-500 hover:text-blue-700 font-bold ${
//                       index === activeTab ? "text-blue-700" : ""
//                     }`}
//                   >
//                     {tab.label}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-4">{tabs[activeTab].content}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;
