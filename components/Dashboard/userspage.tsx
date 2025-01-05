"use client";

import React, { useEffect, useRef, useState } from "react";
import SearchInput from "../Other/SearchInput";
import FullScreenModal from "../Other/FullScreenModal";
import {
  useDeleteUserMutation,
  useExportUsersMutation,
  useUsersQuery,
} from "@/lib/features/userSlice";
import { User } from "@/types/user";
import ConfirmModal from "../Other/confirmModal";
import { BiDownload, BiEdit, BiMessage, BiUpload } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { BsEye } from "react-icons/bs";
import { FiDelete } from "react-icons/fi";
import { getUser } from "@/helpers/auth";
import Loading from "@/app/loading";
import FullScreenExport from "../Other/FullScreenExport";
import { Menu } from "primereact/menu";
import { Avatar, Button, ButtonGroup } from "@mui/material";

const UsersPage = () => {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [modal, setModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const menuRight: any = useRef(null);

  const { data, isLoading, refetch } = useUsersQuery("");
  const [deleteUser] = useDeleteUserMutation();
  const [exportUsers] = useExportUsersMutation();

  const user = getUser();

  const isAdmin = user?.role?.name == "ADMIN";

  const items = [
    {
      label: "Options",
      items: [
        {
          label: "Export PDF",
          icon: "pi pi-refresh",
          command: () => setExportOpen(!exportOpen),
        },
        {
          label: "Export Excel",
          icon: "pi pi-export",
          command: async () => {
            try {
              const res = await exportUsers("").unwrap();
              const blob = new Blob([new Uint8Array(res.data.data)], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `users_data_${Date.now()}.xlsx`);
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    },
  ];

  useEffect(() => {
    if (data) {
      setUsers(data?.data.filter((fuser: User) => fuser.id !== user?.id));
    }
  }, [data, user?.id]);

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
      <FullScreenExport
        refetch={refetch}
        setIsOpen={setExportOpen}
        isOpen={exportOpen}
        users={filteredUsers}
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
            <ButtonGroup
              size="small"
              variant="outlined"
              aria-label="Basic button group"
            >
              <Button onClick={() => setIsOpen(!isOpen)}>Upload</Button>
              <Button
                onClick={() =>
                  (globalThis.location.href = "/dashboard/add-new-user")
                }
              >
                Add
              </Button>
              <Button onClick={(event: any) => menuRight.current.toggle(event)}>
                Export
              </Button>
            </ButtonGroup>

            <Menu
              model={items}
              popup
              ref={menuRight}
              id="popup_menu_right"
              popupAlignment="right"
            />
          </div>
        )}
      </div>
      <div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Picture</th>
              <th className="py-2 px-4 border-b">Name</th>
              {/* {isAdmin && <th className="py-2 px-4 border-b">Email</th>} */}
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Cohort</th>
              <th className="py-2 px-4 border-b">Track</th>
              {isAdmin && <th className="py-2 px-4 border-b">Gender</th>}
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-center">
                  <Avatar
                    alt={user?.firstName + " " + user?.lastName}
                    src={
                      user?.profileImage?.link
                        ? user?.profileImage?.link
                        : user.firstName[0].toUpperCase()
                    }
                  />
                </td>
                <td className="py-2 px-4 border-b text-start">
                  {user.firstName + " " + user.lastName}
                </td>
                {/* {isAdmin && (
                  <td className="py-2 px-4 border-b text-start">
                    {user.email}
                  </td>
                )} */}
                <td className="py-2 px-4 border-b text-center">
                  {user.phoneNumber}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {user.cohort.name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {user.track?.name}
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
                      onClick={() =>
                        (globalThis.location.href =
                          "/dashboard/users/" + user.id)
                      }
                    >
                      <BsEye />
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      className=" bg-green-400 text-xs p-1 rounded"
                      onClick={() =>
                        (globalThis.location.href = "update-profile/" + user.id)
                      }
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
                      globalThis.location.href = `/dashboard/chat/${user?.id}`;
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
    </div>
  );
};

export default UsersPage;
