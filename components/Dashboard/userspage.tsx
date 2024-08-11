"use client";

import React, { useEffect, useState } from "react";
import { Avatar } from "primereact/avatar";
import { useRouter } from "next/navigation";
import SearchInput from "../Other/SearchInput";
import FullScreenModal from "../Other/FullScreenModal";
import { useDeleteUserMutation, useUsersQuery } from "@/lib/features/userSlice";
import { User } from "@/types/user";
import ConfirmModal from "../Other/confirmModal";
import { BiDownload, BiEdit, BiMessage, BiUpload } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { BsEye } from "react-icons/bs";
import { FiDelete } from "react-icons/fi";
import { getUser } from "@/helpers/auth";
import Loading from "@/app/loading";

const UsersPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [modal, setModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch } = useUsersQuery("");
  const [deleteUser] = useDeleteUserMutation();

  const user = getUser();

  const isAdmin = user?.role?.name == "ADMIN";

  console.log(data);

  useEffect(() => {
    if (data) {
      setUsers(data?.data.filter((fuser: User) => fuser.id !== user?.id));
    }
  }, [data, user]);

  const searchUsers = (text: string) => {
    const results = [];
    for (const user of users) {
      if (
        user.firstName.toLowerCase().includes(text.toLowerCase()) ||
        user.lastName.toLowerCase().includes(text.toLowerCase()) ||
        user.email.toLowerCase().includes(text.toLowerCase())
      ) {
        results.push(user);
      }
    }
    return results;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredUsers = searchUsers(searchText);

  const handleDeleteUser = async () => {
    setLoading(true);
    const res = await deleteUser(idToDelete).unwrap();
    if (res.message) {
      refetch();
      setModal(false);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <FullScreenModal
        refetch={refetch}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      {modal && (
        <ConfirmModal
          cancelText="Cancel"
          confirmText={loading ? "Deleting..." : "Confirm"}
          title="Deleting a user"
          description="Are you sure you want to delete a user?"
          closeModal={() => setModal(false)}
          action={handleDeleteUser}
        />
      )}
      <div className="flex justify-between items-center my-2">
        <SearchInput
          value={searchText}
          setValue={handleSearch}
          onSubmit={filteredUsers}
        />
        {isAdmin && (
          <div className="flex gap-2 items-center">
            <button
              className=" right-1 top-1 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
              type="submit"
              onClick={() => setIsOpen(!isOpen)}
            >
              <BiUpload />
            </button>
            <button
              className=" right-1 top-1 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
              type="submit"
              onClick={() => router.push("add-new-user")}
            >
              <CgAdd />
            </button>
            <button
              className=" right-1 top-1 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
              type="submit"
            >
              <BiDownload />
            </button>
          </div>
        )}
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Picture</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            {isAdmin && <th className="py-2 px-4 border-b">Gender</th>}
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b text-center">
                <Avatar
                  image={
                    user?.profileImage?.link
                      ? user?.profileImage?.link
                      : "/placeholder.svg"
                  }
                  shape="circle"
                />
              </td>
              <td className="py-2 px-4 border-b text-center">
                {user.firstName + " " + user.lastName}
              </td>
              <td className="py-2 px-4 border-b text-center">{user.email}</td>
              <td className="py-2 px-4 border-b text-center">
                {user.phoneNumber}
              </td>
              {isAdmin && (
                <td className="py-2 px-4 border-b text-center">
                  {user.genderName}
                </td>
              )}
              <td className="py-2 px-4 flex items-center justify-center gap-1 mt-1 text-white">
                {isAdmin && (
                  <button
                    className=" bg-mainBlue text-xs p-1  rounded"
                    onClick={() => router.push("users/" + user.id)}
                  >
                    <BsEye />
                  </button>
                )}
                {isAdmin && (
                  <button
                    className=" bg-green-400 text-xs p-1 rounded"
                    onClick={() => router.push("update-profile/" + user.id)}
                  >
                    <BiEdit />
                  </button>
                )}
                {isAdmin && (
                  <button
                    className=" bg-red-600 text-xs p-1 rounded"
                    onClick={async (e) => {
                      e.preventDefault();
                      setIdToDelete(user?.id);
                      setModal(true);
                    }}
                  >
                    <FiDelete />
                  </button>
                )}
                <button
                  className=" bg-gray-600 text-xs p-1 rounded"
                  onClick={async (e) => {
                    e.preventDefault();
                    router.push(`/dashboard/chat/${user?.id}`);
                  }}
                >
                  <BiMessage />
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
