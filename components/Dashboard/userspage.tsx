"use client";

import React, { useEffect, useState, useRef } from "react";
import SearchInput from "../Other/SearchInput";
import FullScreenModal from "../Other/FullScreenModal";
import FullScreenExport from "../Other/FullScreenExport";
import ConfirmModal from "../Other/confirmModal";
import TopTitle from "../Other/TopTitle";
import Loading from "@/app/loading";

import {
  useDeleteUserMutation,
  useExportUsersMutation,
  useUsersQuery,
} from "@/lib/features/userSlice";
import { User } from "@/types/user";
import { getUser } from "@/helpers/auth";

interface UserCardProps {
  user: User;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isAdmin, onDelete }) => {
  const primaryOrg =
    user.organizationFounded?.name || user.organizationEmployed?.name;
  const primaryPosition = user.positionInFounded || user.positionInEmployed;

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
      <div className="flex-1 min-w-0">
        <div className="text-xl font-bold text-gray-800 truncate">
          {user.firstName} {user.lastName}
          {user.role?.name && (
            <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
              {user.role.name}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 truncate">{user.email}</p>
        <p className="text-sm font-medium text-purple-600 mt-1">
          Track: {user.track?.name || "N/A"}
        </p>
        {(primaryOrg || primaryPosition) && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            {primaryPosition && `${primaryPosition} at `}
            {primaryOrg || "No Organization Listed"}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2 shrink-0">
        <button
          onClick={() =>
            (globalThis.location.href = "/dashboard/users/" + user.id)
          }
          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition duration-150"
          title="View Profile"
        >
          <span className="text-sm">👁️ View</span>
        </button>
        <button
          onClick={() =>
            (globalThis.location.href = "/dashboard/update-profile/" + user.id)
          }
          className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 transition duration-150"
          title="Edit Profile"
        >
          <span className="text-sm">✏️ Edit</span>
        </button>
        <button
          onClick={() =>
            (globalThis.location.href = `/dashboard/chat/${user?.id}`)
          }
          className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50 transition duration-150"
          title="Send Message"
        >
          {/* Placeholder for Email Icon */}
          <span className="text-sm">📧 Message</span>
        </button>
        {isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(user.id);
            }}
            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition duration-150"
            title="Delete User"
          >
            {/* Placeholder for Delete Icon */}
            <span className="text-sm">🗑️ Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

const ExportDropdown: React.FC<{ items: any; menuRef: any }> = ({
  items,
  menuRef,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleExportAction = (command: () => Promise<void> | void) => {
    command();
    setDropdownOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
      >
        <span className="mr-1">🖨️ Export</span>
        <svg
          className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {items[0].items.map((item: any) => (
              <button
                key={item.label}
                onClick={() => handleExportAction(item.command)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-100"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main UsersPage Component ---

const UsersPage = () => {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false); // For FullScreenModal (Upload)
  const [exportOpen, setExportOpen] = useState(false); // For FullScreenExport (PDF)
  const [users, setUsers] = useState<User[]>([]);
  const [modal, setModal] = useState(false); // For ConfirmModal (Delete)
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Replaces menuRight ref

  const { data, isLoading, refetch } = useUsersQuery("");
  const [deleteUser] = useDeleteUserMutation();
  const [exportUsers] = useExportUsersMutation();

  const user = getUser();
  const isAdmin = user?.role?.name === "ADMIN";

  // Define export items for the new dropdown
  const exportItems = [
    {
      items: [
        {
          label: "Export PDF",
          command: () => setExportOpen(true),
        },
        {
          label: "Export Excel",
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
              console.error("Export error:", error);
            }
          },
        },
      ],
    },
  ];

  useEffect(() => {
    if (data) {
      // Filter out the current user
      setUsers(data?.data.filter((fuser: User) => fuser.id !== user?.id));
    }
  }, [data, user?.id]);

  // Search logic remains the same
  const searchUsers = (text: string) => {
    const results: User[] = [];
    for (const userItem of users) {
      if (
        userItem.firstName.toLowerCase().includes(text.toLowerCase()) ||
        userItem.lastName.toLowerCase().includes(text.toLowerCase()) ||
        userItem.email.toLowerCase().includes(text.toLowerCase())
      ) {
        results.push(userItem);
      }
    }
    return results;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredUsers = searchUsers(searchText);

  const triggerDeleteModal = (id: string) => {
    setIdToDelete(id);
    setModal(true);
  };

  const handleDeleteUser = async () => {
    if (!idToDelete) return;

    setLoading(true);
    try {
      const res = await deleteUser(idToDelete).unwrap();
      if (res.message) {
        refetch();
        setModal(false);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Optional: Add error handling state here
    } finally {
      setLoading(false);
      setIdToDelete(null);
    }
  };

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Modals */}
      <FullScreenModal
        refetch={refetch}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      <FullScreenExport
        // refetch={refetch}
        setIsOpen={setExportOpen}
        isOpen={exportOpen}
        users={filteredUsers}
      />
      {modal && (
        <ConfirmModal
          cancelText="Cancel"
          confirmText={loading ? "Deleting..." : "Confirm"}
          title="Deleting a user"
          description="Are you sure you want to delete this user?"
          closeModal={() => setModal(false)}
          action={handleDeleteUser}
        />
      )}

      <TopTitle title="Members List" />

      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center my-6 gap-4">
        <div className="w-full md:w-1/3">
          <SearchInput
            value={searchText}
            setValue={handleSearch}
            onSubmit={filteredUsers} // Note: onSubmit likely triggers a query/fetch, here it just uses local state
          />
        </div>

        {isAdmin && (
          <div className="flex flex-wrap gap-3">
            {/* Action Buttons */}
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
            >
              📤 Upload
            </button>
            <button
              onClick={() =>
                (globalThis.location.href = "/dashboard/add-new-user")
              }
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150"
            >
              ➕ Add Member
            </button>

            {/* Export Dropdown */}
            <ExportDropdown items={exportItems} menuRef={menuRef} />
          </div>
        )}
      </div>

      {/* User List Cards */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((userItem) => (
            <UserCard
              key={userItem.id}
              user={userItem}
              isAdmin={isAdmin}
              onDelete={triggerDeleteModal}
            />
          ))
        ) : (
          <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-lg text-gray-500">
              No members found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
