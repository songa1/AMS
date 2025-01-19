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
import { Box, Button, TextField, Typography } from "@mui/material";

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
            <p className="bg-red-500 text-white rounded-md text-center p-2 w-full">
              {error}
            </p>
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
            />

            <TextField
              type="password"
              label="Password:"
              variant="filled"
              value={formik.values.password}
              onChange={(e) => formik.setFieldValue("password", e.target.value)}
              required
              placeholder="Enter your password"
            />
          </Box>

          <div className="flex justify-between items-center mt-1">
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
          </div>
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
