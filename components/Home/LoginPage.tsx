"use client";

import Header from "@/components/Home/Header";
import InputError from "@/components/Other/InputError";
import { useLoginMutation } from "@/lib/features/authSlice";
import { useFormik } from "formik";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { AUTH_STORED_DATA } from "@/helpers/auth";

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
    <div className="flex h-screen lg:inline ">
      <div className="w-full lg:w min-w-[300px] flex flex-col  items-center border border-mainBlue max-w-[40%] mx-auto mt-7 p-3 rounded-md shadow-xl">
        <Header />
        <div className="w-full h-2 bg-mainBlue shadow-md"></div>
        <div className="w-full space-y-8 mt-20">
          <form className="w-full">
            {error && (
              <p className="bg-red-500 text-white rounded-md text-center p-2 w-full">
                {error}
              </p>
            )}
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={(e) => formik.setFieldValue("email", e.target.value)}
                required
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter your email address"
              />
              {formik.errors.email && formik.touched.email && (
                <InputError error={formik.errors.email} />
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={(e) =>
                  formik.setFieldValue("password", e.target.value)
                }
                required
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter your password"
              />
              {formik.errors.password && formik.touched.password && (
                <InputError error={formik.errors.password} />
              )}
              <div className="flex justify-between items-center mt-1">
                <div></div>
                <Link
                  href="/forgotpassword"
                  className="text-yellow-500 text-xs underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-mainBlue text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-3 focus:outline-none focus:bg-blue-600"
                onClick={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
                {isLoading ? "Loading.." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
