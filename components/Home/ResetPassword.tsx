"use client";

import Header from "@/components/Home/Header";
import { useResetPasswordMutation } from "@/lib/features/authSlice";
import { useFormik } from "formik";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

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
    <div className="flex h-screen lg:inline ">
      <div className="w-full lg:w min-w-[300px] flex flex-col  items-center border border-mainBlue max-w-[40%] mx-auto mt-7 p-3 rounded-md shadow-xl">
        <Header />
        <div className="w-full h-2 bg-mainBlue shadow-md"></div>
        <div className="w-full space-y-8 mt-20">
          <h1 className="mb-4 text-2xl font-bold">Change your Password</h1>
          {success && (
            <div className="flex flex-col gap-3 justify-center items-center">
              {" "}
              <p className="bg-green-500 text-white rounded-md text-center p-2 w-full">
                {success}
              </p>
              <Link href="/" className="underline">
                Go to Login
              </Link>
            </div>
          )}
          {!success && (
            <form className="mt-4 space-y-6">
              {error && (
                <p className="bg-red-500 text-white rounded-md text-center p-2 w-full">
                  {error}
                </p>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password:
                </label>
                <input
                  type="password"
                  value={formik.values.password}
                  onChange={(e) =>
                    formik.setFieldValue("password", e.target.value)
                  }
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="Enter the new password"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Repeat Password:
                </label>
                <input
                  type="password"
                  value={formik.values.cPassword}
                  onChange={(e) =>
                    formik.setFieldValue("cPassword", e.target.value)
                  }
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="Repeat the new password"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-mainBlue text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  onClick={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
