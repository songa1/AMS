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
import { getUser } from "@/helpers/auth";
import Loading from "@/app/loading";
import FullScreenExport from "../Other/FullScreenExport";
import { Menu } from "primereact/menu";
import { Button, ButtonGroup } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import TopTitle from "../Other/TopTitle";
import PrintIcon from "@mui/icons-material/Print";

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

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone Number", width: 150 },
    { field: "gender", headerName: "Gender", width: 130 },
    { field: "cohort", headerName: "Cohort", width: 70 },
    { field: "track", headerName: "Track", width: 140 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      getActions: ({ id }: { id: string }) => {
        return [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="View"
            className="textPrimary"
            onClick={() =>
              (globalThis.location.href = "/dashboard/users/" + user.id)
            }
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() =>
              (globalThis.location.href = "update-profile/" + user.id)
            }
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={async (e) => {
              e.preventDefault();
              setIdToDelete(user?.id);
              setModal(true);
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<EmailIcon />}
            label="Message"
            onClick={async (e) => {
              e.preventDefault();
              globalThis.location.href = `/dashboard/chat/${user?.id}`;
            }}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const rows = filteredUsers.map((user) => {
    return {
      id: user.id,
      name: user?.firstName + " " + user?.lastName,
      email: user.email,
      phone: user.phoneNumber,
      gender: user.genderName,
      cohort: user.cohort.name,
      track: user.track?.name,
    };
  });

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
      <TopTitle title="Members List" />
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
              <Button
                onClick={(event: any) => menuRight.current.toggle(event)}
                startIcon={<PrintIcon fontSize="inherit" />}
              >
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
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          initialState={{
            pagination: { paginationModel: { pageSize: 20 } },
          }}
          sx={(theme) => ({
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[700]
                : theme.palette.grey[200],
            "& .MuiDataGrid-cell": {
              borderColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[200],
            },
          })}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      </div>
    </div>
  );
};

export default UsersPage;
