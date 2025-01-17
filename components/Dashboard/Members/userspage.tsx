"use client";

import React, { useEffect, useState } from "react";
import SearchInput from "../../Other/SearchInput";
import FullScreenModal from "../../Other/FullScreenModal";
import {
  useDeleteUserMutation,
  useExportUsersMutation,
  useUsersQuery,
} from "@/lib/features/userSlice";
import { User } from "@/types/user";
import ConfirmModal from "../../Other/confirmModal";
import { getUser } from "@/helpers/auth";
import Loading from "@/app/loading";
import FullScreenExport from "../../Other/FullScreenExport";
import { Box, Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import TopTitle from "../../Other/TopTitle";
import PrintIcon from "@mui/icons-material/Print";

const UsersPage = () => {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [modal, setModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data, isLoading, refetch } = useUsersQuery("");
  const [deleteUser] = useDeleteUserMutation();
  const [exportUsers] = useExportUsersMutation();

  const user = getUser();

  const isAdmin = user?.role?.name == "ADMIN";

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

  const columns: GridColDef[] = [
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
      getActions: (params: GridRowParams<any>): React.ReactElement[] => {
        const id: any = params.id;
        const acts = [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="View"
            className="textPrimary"
            onClick={() =>
              (globalThis.location.href = "/dashboard/users/" + id)
            }
            color="inherit"
            key="view"
          />,
          isAdmin ? (
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() =>
                (globalThis.location.href = "update-profile/" + id)
              }
              color="inherit"
              key="edit"
            />
          ) : null,
          isAdmin ? (
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={async (e) => {
                e.preventDefault();
                setIdToDelete(id);
                setModal(true);
              }}
              color="inherit"
              key="delete"
            />
          ) : null,
          <GridActionsCellItem
            icon={<EmailIcon />}
            label="Message"
            onClick={async (e) => {
              e.preventDefault();
              globalThis.location.href = `/dashboard/chat/${id}`;
            }}
            color="inherit"
            key="message"
          />,
        ];
        return acts.filter(
          (action): action is React.ReactElement => action != null
        );
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="container mx-auto p-4">
      <FullScreenModal
        refetch={refetch}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      {/*<FullScreenExport
        setIsOpen={setExportOpen}
        isOpen={exportOpen}
        users={filteredUsers}
      /> */}
      <ConfirmModal
        open={modal}
        cancelText="Cancel"
        confirmText={loading ? "Deleting..." : "Confirm"}
        title="Are you sure you want to delete a user?"
        description="Please note that this action is irreversible."
        closeModal={() => setModal(false)}
        action={handleDeleteUser}
      />

      <TopTitle title="Members List" />
      <Box className="flex justify-between items-center my-2">
        <SearchInput
          value={searchText}
          setValue={handleSearch}
          onSubmit={filteredUsers}
        />
        {isAdmin && (
          <Box className="flex gap-2 items-center">
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
                id="basic-button"
                onClick={handleClick}
                variant="outlined"
                startIcon={<PrintIcon fontSize="inherit" />}
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                Export
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    setExportOpen(!exportOpen);
                    handleClose();
                  }}
                >
                  Export PDF
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    try {
                      const res = await exportUsers("").unwrap();
                      const blob = new Blob([new Uint8Array(res.data.data)], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute(
                        "download",
                        `users_data_${Date.now()}.xlsx`
                      );
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    } catch (error) {
                      console.log(error);
                    }

                    handleClose();
                  }}
                >
                  Export Excel
                </MenuItem>
              </Menu>
            </ButtonGroup>
          </Box>
        )}
      </Box>
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
    </Box>
  );
};

export default UsersPage;
