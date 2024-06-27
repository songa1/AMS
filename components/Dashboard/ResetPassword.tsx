// pages/change-password.tsx
"use client";

import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import InputError from "../Other/InputError";
import { useChangePasswordMutation } from "@/lib/features/authSlice";
import { AUTH_STORED_DATA, getUser } from "@/helpers/auth";
import Cookies from "js-cookie";

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
        }
      }
    },
  });

  return (
    <div className="flex items-center justify-center  w-full p-10 ">
      <div className="p-6 bg-white rounded shadow-md">
        <form onSubmit={formik.handleSubmit}>
          <label
            htmlFor="old-password"
            className="block text-sm font-medium text-gray-700"
          >
            Old Password:
          </label>
          <input
            type="password"
            id="Old-password"
            value={formik.values.oldPassword}
            onChange={(e) =>
              formik.setFieldValue("oldPassword", e.target.value)
            }
            className="w-full p-2 mt-1 border rounded"
          />
          {formik.errors.oldPassword && formik.touched.oldPassword && (
            <InputError error={formik.errors.oldPassword} />
          )}
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password:
          </label>
          <input
            type="password"
            id="password"
            value={formik.values.newPassword}
            onChange={(e) =>
              formik.setFieldValue("newPassword", e.target.value)
            }
            className="w-full p-2 mt-1 border rounded"
          />
          {formik.errors.newPassword && formik.touched.newPassword && (
            <InputError error={formik.errors.newPassword} />
          )}
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirm-password"
            value={formik.values.confirmPassword}
            onChange={(e) =>
              formik.setFieldValue("confirmPassword", e.target.value)
            }
            className="w-full p-2 mt-1 border rounded"
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <InputError error={formik.errors.confirmPassword} />
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-mainBlue  rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePasswordPage;
