// pages/change-password.tsx
"use client";

import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { useChangePasswordMutation } from "@/lib/features/authSlice";
import { AUTH_STORED_DATA, getUser } from "@/helpers/auth";
import Cookies from "js-cookie";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import TopTitle from "../Other/TopTitle";

const ChangePasswordPage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = getUser();

  const [changePassword] = useChangePasswordMutation();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string().min(8).required("Password is required"),
      confirmPassword: Yup.string()
        .required("Kindly repeat the new password!")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await changePassword({
          userId: user?.id,
          pastPassword: values?.oldPassword,
          password: values?.newPassword,
        });
        if (res?.data?.status == 200) {
          Cookies.remove(AUTH_STORED_DATA?.TOKEN);
          Cookies.remove(AUTH_STORED_DATA?.USER);
          globalThis.location.href = "/";
        }
      } catch (error: any) {
        console.log(error);
        if (error?.status == 401) {
          formik.setFieldError("oldPassword", error?.error);
          setError(error?.error);
        }
      }
    },
  });

  return (
    <div className="flex items-center justify-center flex-col w-full p-10 ">
      <TopTitle title="Change Password" />

      <Box className="p-6 rounded shadow-md w-full">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col gap-3"
        >
          <TextField
            id="filled-password-input"
            label="Old Password"
            type="password"
            autoComplete="old-password"
            variant="filled"
            fullWidth={true}
            value={formik.values.oldPassword}
            onChange={(e) =>
              formik.setFieldValue("oldPassword", e.target.value)
            }
            error={
              formik.errors.oldPassword && formik.touched.oldPassword
                ? true
                : false
            }
            helperText={
              formik.errors.oldPassword && formik.touched.oldPassword
                ? formik.errors.oldPassword
                : ""
            }
          />

          <TextField
            id="filled-password-input-1"
            label="New Password"
            type="password"
            autoComplete="new-password"
            variant="filled"
            fullWidth={true}
            value={formik.values.newPassword}
            onChange={(e) =>
              formik.setFieldValue("newPassword", e.target.value)
            }
            error={
              formik.errors.newPassword && formik.touched.newPassword
                ? true
                : false
            }
            helperText={
              formik.errors.newPassword && formik.touched.newPassword
                ? formik.errors.newPassword
                : ""
            }
          />

          <TextField
            id="filled-password-input-1"
            label="New Password"
            type="password"
            autoComplete="new-password"
            variant="filled"
            fullWidth={true}
            value={formik.values.confirmPassword}
            onChange={(e) =>
              formik.setFieldValue("confirmPassword", e.target.value)
            }
            error={
              formik.errors.confirmPassword && formik.touched.confirmPassword
                ? true
                : false
            }
            helperText={
              formik.errors.confirmPassword && formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : ""
            }
          />

          <Button
            type="submit"
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-mainBlue  rounded hover:bg-blue-700"
            disabled={loading}
            variant="contained"
            size="large"
          >
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </form>
        {message && (
          <Alert severity="success" variant="filled">
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        )}
      </Box>
    </div>
  );
};

export default ChangePasswordPage;
