/* eslint-disable @next/next/no-img-element */
"use client";

import Header from "@/components/Home/Header";
import { useLoginMutation } from "@/lib/features/authSlice";
import { useFormik } from "formik";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { AUTH_STORED_DATA } from "@/helpers/auth";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid Email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      if (formik.errors.email || formik.errors.password) {
        setError(
          `Please correct these problems: ${formik.errors.email || formik.errors.password}`
        );
        return;
      }
      setIsLoading(true);
      try {
        const result = await login(values).unwrap();
        localStorage.setItem(
          AUTH_STORED_DATA?.USER,
          JSON.stringify(result?.user)
        );
        Cookies.set(AUTH_STORED_DATA?.TOKEN, result?.token, {
          expires: 7,
        });
        Cookies.set(AUTH_STORED_DATA?.USER, JSON.stringify(result?.user), {
          expires: 7,
        });
        if (result?.status === 200) {
          formik.resetForm();
          localStorage.setItem(
            AUTH_STORED_DATA?.USER,
            JSON.stringify(result?.user)
          );
          Cookies.set(AUTH_STORED_DATA?.TOKEN, result?.token, {
            expires: 7,
          });
          Cookies.set(AUTH_STORED_DATA?.USER, JSON.stringify(result?.user), {
            expires: 7,
          });
          if (result?.user?.role?.name == "ADMIN") {
            globalThis.location.href = "/dashboard";
          } else {
            globalThis.location.href = "/dashboard/profile";
          }
        }
      } catch (err: any) {
        if (err?.status === 401) {
          setError(err?.data?.error);
        }
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 10000);
      return () => clearTimeout(timer);
    }
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <TextField
              type="email"
              label="Email:"
              value={formik.values.email}
              onChange={(e) => formik.setFieldValue("email", e.target.value)}
              required
              variant="filled"
              placeholder="Enter your email address"
              error={formik.errors.email ? true : false}
              helperText={formik.errors.email}
            />

            <TextField
              type="password"
              label="Password:"
              variant="filled"
              value={formik.values.password}
              onChange={(e) => formik.setFieldValue("password", e.target.value)}
              required
              placeholder="Enter your password"
              error={formik.errors.password ? true : false}
              helperText={formik.errors.password}
            />
          </Box>

          <Box className="flex justify-between items-center mt-1">
            <div></div>
            <Link href="/forgotpassword">
              <Typography
                color="warning"
                variant="subtitle1"
                className="underline"
              >
                Forgot Password?
              </Typography>
            </Link>
          </Box>
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
            {isLoading ? "Loading.." : "Login"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
