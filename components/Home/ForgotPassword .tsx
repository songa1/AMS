// pages/forgot-password.tsx
"use client";

import { useRequestResetMutation } from "@/lib/features/authSlice";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Header from "./Header";
import { Alert, Box, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ForgotPasswordPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [requestReset] = useRequestResetMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid Email").required("Email is required"),
    }),
    onSubmit: async (values) => {
      if (formik.errors.email) {
        setError(`Please resolve this issue: ${formik.errors.email}`);
        return;
      }
      setLoading(true);
      try {
        const response = await requestReset(values).unwrap();

        if (response.status === 200) {
          setSuccess(response.message);
        }
      } catch (error: any) {
        if (error?.status === 404) {
          setError(error?.data?.message);
        } else {
          setError("Action Failed! Try again, or contact the administrator!");
        }
      } finally {
        setLoading(false);
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
        <form className="w-full max-w-md shadow-md md:p-5 p-2">
          <Header />

          {error && (
            <Alert variant="filled" severity="error" className="my-2">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="filled" severity="success" className="my-2">
              {success}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <TextField
              type="email"
              variant="filled"
              label="Enter your email address:"
              error={formik.errors.email ? true : false}
              placeholder="eg: example@domain.com"
              value={formik.values.email}
              onChange={(e) => formik.setFieldValue("email", e.target.value)}
              required
              helperText={formik.errors.email}
            />
            <Box className="flex flex-col gap-1">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="w-full mt-2"
                onClick={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
                {loading ? "Requesting..." : "Request Password Reset"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  globalThis.location.href = "/";
                }}
                startIcon={<ArrowBackIcon />}
              >
                Back to Login
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
