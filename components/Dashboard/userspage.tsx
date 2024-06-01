import React, { useState } from "react";
import { Avatar } from "primereact/avatar";
import { useRouter } from "next/navigation";
import SearchInput from "../Other/SearchInput";
import FullScreenModal from "../Other/FullScreenModal";

export const users = [
    {
        id: 1,
        name: "Mukamugema Sophie",
        email: "sophiemukamugema@gmail.com",
        phone: "+250789635342",
        gender: "Female",
    },
    {
        id: 2,
        name: "Songa Achille",
        email: "achillesonga12@gmail.com",
        phone: "+25078963234",
        gender: "Male",
    },
    {
        id: 3,
        name: "Valens Ntirenganya",
        email: "vava12@gmail.com",
        phone: "+250789635342",
        gender: "Male",
    }
];

const UsersPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchUsers = (text: string) => {
    const results = [];
    for (const user of users) {
      if (user.name.toLowerCase().includes(text.toLowerCase())) {
        results.push(user);
      }
    }
    return results;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredUsers = searchUsers(searchText);

  return (
    <div className="container mx-auto p-4">
      <FullScreenModal setIsOpen={setIsOpen} isOpen={isOpen} />
      <div className="flex justify-between items-center my-2">
        <SearchInput
          value={searchText}
          setValue={handleSearch}
          onSubmit={filteredUsers}
        />
        <div className="flex gap-2 items-center">
          <button
            className=" right-1 top-1 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
            type="submit"
            onClick={() => setIsOpen(!isOpen)}
          >
            Upload Users
          </button>
          <button
            className=" right-1 top-1 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
            type="submit"
            onClick={() => router.push("add-new-user")}
          >
            Add a New User
          </button>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Picture</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Gender</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">
                <Avatar image="/profile.jpg" shape="circle" />
              </td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.phone}</td>
              <td className="py-2 px-4 border-b">{user.gender}</td>
              <td className="py-2 px-4 flex gap-1 mt-1">
                <button
                  className=" bg-mainBlue text-xs p-1  rounded"
                  onClick={() => router.push("profile")}
                >
                  View
                </button>
                <button
                  className=" bg-green-400 text-xs p-1 rounded"
                  onClick={() => router.push("update-profile")}
                >
                  Edit
                </button>
                <button className=" bg-red-600 text-xs p-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
