"use client";

import Header from "@/components/Home/Header";
import { useResetPasswordMutation } from "@/lib/features/authSlice";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { SectionTitle } from "../Other/TopTitle";

const ResetPassword = () => {
  const { token } = useParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [resetPassword] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: {
      password: "",
      cPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().min(8).required("Password is required"),
      cPassword: Yup.string()
        .required("Kindly repeat the new password!")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const result = await resetPassword({
          token,
          newPassword: values.password,
        }).unwrap();

        formik.resetForm();
        setSuccess(result.message);
      } catch (err: any) {
        console.error("Failed to reset:", err);
        if (err?.status === 401) {
          setError(err?.data?.error);
        } else {
          setError("Reset Failed! Try again, or contact the administrator!");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    error &&
      setTimeout(() => {
        setError("");
      }, 5000);
  }, [error]);

  return (
    <Box className="w-full h-screen flex flex-col md:flex-row">
      <Box
        className="w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center"
        style={{ backgroundImage: `url('/yali_alumni.jpg')` }}
      ></Box>
      <Box className="w-full md:w-1/2 h-full p-8 md:p-20 flex items-center justify-center">
        {success && (
          <Box className="flex flex-col gap-3 justify-center items-center">
            <Alert severity="success" variant="filled" className="my-2">
              {success}
            </Alert>
            <Link href="/" className="underline">
              <Typography variant="subtitle1" color="primary">
                Go to Login
              </Typography>
            </Link>
          </Box>
        )}
        {!success && (
          <form className="mt-4 space-y-6">
            <Header />
            <Typography
              fontWeight={600}
              variant="h6"
              className="text-center text-mainBlue m-0"
            >
              Change your Password
            </Typography>
            {error && (
              <Alert severity="error" variant="filled">
                {error}
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <TextField
                label="New Password:"
                type="password"
                value={formik.values.password}
                onChange={(e) =>
                  formik.setFieldValue("password", e.target.value)
                }
                required
                variant="filled"
                placeholder="Enter the new password"
              />
              <TextField
                label="Repeat Password:"
                type="password"
                value={formik.values.cPassword}
                onChange={(e) =>
                  formik.setFieldValue("cPassword", e.target.value)
                }
                required
                variant="filled"
                placeholder="Repeat the new password"
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full mt-2"
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default ResetPassword;
