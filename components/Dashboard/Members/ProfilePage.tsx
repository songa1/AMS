"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { User } from "@/types/user";

import Loading from "@/app/loading";
import { getUser } from "@/helpers/auth";
import Link from "next/link";
import {
  useChangeMutation,
  useGetOneUserQuery,
} from "@/lib/features/userSlice";
import ConfirmModal from "../../Other/confirmModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import TopTitle from "../../Other/TopTitle";

function ProfilePage() {
  dayjs.extend(relativeTime);
  const { id } = useParams();
  const toast: any = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roleModal, setRoleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

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
        <Box className="flex gap-3 items-center">
          <img
            src={`${
              user?.profileImage?.link
                ? user?.profileImage?.link
                : "/placeholder.svg"
            }`}
            className="w-48 h-48 object-cover rounded-full"
          />
          <div className="flex flex-col gap-3">
            <Typography variant="h5" fontWeight={700}>
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
            </Typography>
            <Typography variant="body1">{user?.bio}</Typography>
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
        </Box>
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
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
            paddingTop: "30px",
          }}
        >
          <TextField label="Email" value={user?.email} disabled={!edit} />
          <TextField
            value={user?.phoneNumber}
            label="Phone Number"
            disabled={!edit}
          />
          <TextField
            label="WhatsApp Number"
            value={user?.whatsappNumber}
            disabled={!edit}
          />
          <TextField
            value={user?.genderName ? user?.genderName : "--"}
            label="Gender"
            disabled={!edit}
          />

          <TextField
            label="Resident Country"
            value={
              user?.residentCountry?.name ? user?.residentCountry?.name : "--"
            }
            disabled={!edit}
          />
          {user?.residentCountry && user?.residentCountry?.id === "RW" && (
            <TextField
              label="Resident District"
              value={
                user?.residentDistrict?.name
                  ? user?.residentDistrict?.name
                  : "--"
              }
              disabled={!edit}
            />
          )}
          {user?.residentCountry && user?.residentCountry?.id === "RW" && (
            <TextField
              label="Resident Sector"
              value={
                user?.residentSector?.name ? user?.residentSector?.name : "--"
              }
              disabled={!edit}
            />
          )}
          <TextField
            label="Cohort"
            value={user?.cohort?.name ? user?.cohort?.name : "--"}
            disabled={!edit}
          />

          <TextField
            label="Nearest Landmark"
            value={user?.nearestLandmark ? user?.nearestLandmark : "--"}
            disabled={!edit}
          />
          <TextField
            label="Track"
            value={user?.track ? user?.track?.name : "--"}
            disabled={!edit}
          />
          <TextField
            label="Facebook Account"
            value={user?.facebook ? user?.facebook : "--"}
            disabled={!edit}
          />
          <TextField
            label="Instagram Account"
            value={user?.instagram ? user?.instagram : "--"}
            disabled={!edit}
          />
          <TextField
            label="LinkedIn Account"
            value={user?.linkedin ? user?.linkedin : "--"}
            disabled={!edit}
          />
          <TextField
            label="Twitter Account"
            value={user?.twitter ? user?.twitter : "--"}
            disabled={!edit}
          />
        </Box>
        <TopTitle title="Organization I founded" />
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
            paddingTop: "10px",
          }}
        >
          <TextField
            label="Initiative Name"
            value={
              user?.organizationFounded?.name
                ? user?.organizationFounded?.name
                : "--"
            }
            disabled={!edit}
          />
          <TextField
            label="Main Sector"
            value={
              user?.organizationFounded?.workingSector?.name
                ? user?.organizationFounded?.workingSector?.name
                : "--"
            }
            disabled={!edit}
          />
          <TextField
            value={user?.positionInFounded ? user?.positionInFounded : "--"}
            label="Position"
            disabled={!edit}
          />
          <TextField
            disabled={!edit}
            label="Website"
            value={
              user?.organizationFounded?.website
                ? user?.organizationFounded?.website
                : "--"
            }
          />
          <TextField
            label="Country"
            value={
              user?.organizationFounded?.district?.name
                ? user?.organizationFounded?.district?.name
                : "--"
            }
            disabled={!edit}
          />
          {user?.organizationFounded &&
            user?.organizationFounded?.country?.id == "RW" && (
              <TextField
                value={
                  user?.organizationFounded?.district?.name
                    ? user?.organizationFounded?.district?.name
                    : "--"
                }
                disabled={!edit}
                label="District"
              />
            )}
          {user?.organizationFounded &&
            user?.organizationFounded?.country?.id == "RW" && (
              <TextField
                label="Sector"
                disabled={!edit}
                value={user?.organizationFounded?.sector?.name}
              />
            )}
        </Box>
        <TopTitle title="Organization I work for" />
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
            paddingTop: "10px",
          }}
        >
          <TextField
            label="Company Name"
            value={
              user?.organizationEmployed?.name
                ? user?.organizationEmployed?.name
                : "--"
            }
            disabled={!edit}
          />

          <TextField
            value={
              user?.organizationEmployed?.workingSector?.name
                ? user?.organizationEmployed?.workingSector?.name
                : "--"
            }
            disabled={!edit}
            label="Company Sector"
          />
          <TextField
            value={user?.positionInEmployed ? user?.positionInEmployed : "--"}
            disabled={!edit}
            label="Position"
          />
          <TextField
            value={
              user?.organizationEmployed?.website
                ? user?.organizationEmployed?.website
                : "--"
            }
            disabled={!edit}
            label="Website"
          />
          <TextField
            value={
              user?.organizationEmployed?.country?.name
                ? user?.organizationEmployed?.country?.name
                : "--"
            }
            disabled={!edit}
            label="Country"
          />
          {user?.organizationEmployed &&
            user?.organizationEmployed?.country?.id == "RW" && (
              <TextField
                value={
                  user?.organizationEmployed?.district?.name
                    ? user?.organizationEmployed?.district?.name
                    : "--"
                }
                disabled={!edit}
                label="District"
              />
            )}
          {user?.organizationEmployed &&
            user?.organizationEmployed?.country?.id == "RW" && (
              <TextField
                value={
                  user?.organizationEmployed?.sector?.name
                    ? user?.organizationEmployed?.sector?.name
                    : "--"
                }
                disabled={!edit}
                label="Sector"
              />
            )}
        </Box>
      </div>
    </div>
  );
}

export default ProfilePage;
