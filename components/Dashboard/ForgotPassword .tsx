// pages/forgot-password.tsx
"use client";

import { useRequestResetMutation } from "@/lib/features/authSlice";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import InputError from "../Other/InputError";
import Header from "../Home/Header";

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
    <div className="flex items-center justify-center w-full">
      <div className="w-full lg:w min-w-[300px] flex flex-col  items-center border border-mainBlue max-w-[40%] mx-auto mt-7 p-3 rounded-md shadow-xl">
        <Header />
        <div className="w-full h-2 bg-mainBlue shadow-md"></div>
        <h1 className="my-3 text-2xl font-bold">Forgot Password</h1>
        {success && (
          <p className="bg-green-500 text-white rounded-md text-center p-2 w-full">
            {success}
          </p>
        )}
        {!success && (
          <form className="w-full">
            {error && (
              <p className="bg-red-500 text-white rounded-md text-center p-2 w-full">
                {error}
              </p>
            )}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mt-2"
            >
              Enter your email address:
            </label>
            <input
              type="email"
              id="email"
              value={formik.values.email}
              onChange={(e) => formik.setFieldValue("email", e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded"
            />
            {formik.errors.email && formik.touched.email && (
              <InputError error={formik.errors.email} />
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 font-bold text-white bg-mainBlue rounded hover:bg-mainblue-700"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              {loading ? "Requesting..." : "Request Password Reset"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
