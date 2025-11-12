// pages/forgot-password.tsx
"use client";

import { useRequestResetMutation } from "@/lib/features/authSlice";
import React, { useEffect, useState } from "react";
import Header from "../Home/Header";

const validateEmail = (email: string): string => {
  if (!email) {
    return "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    return "Invalid Email";
  }
  return "";
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [requestReset] = useRequestResetMutation();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform validation
    const validationError = validateEmail(email);
    setEmailError(validationError);

    // If there's a validation error, stop submission
    if (validationError) {
      return;
    }

    setLoading(true);
    setError(""); // Clear previous API error
    setSuccess(""); // Clear previous success message

    try {
      const values = { email };
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
  };

  // Effect to clear API error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle input change and perform live validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Clear validation error when the user starts typing again
    if (emailError) {
      setEmailError(validateEmail(newEmail));
    }
  };

  // Handle blur to show error when leaving the field
  const handleBlur = () => {
    setEmailError(validateEmail(email));
  };

  return (
    <div className="flex items-center justify-center w-full">
      {/* Container with existing Tailwind classes */}
      <div className="w-full lg:w min-w-[300px] flex flex-col items-center border border-mainBlue max-w-[40%] mx-auto mt-7 p-3 rounded-md shadow-xl">
        <Header />
        <div className="w-full h-2 bg-mainBlue shadow-md"></div>
        <h1 className="my-3 text-2xl font-bold">Forgot Password</h1>

        {success && (
          <p className="bg-green-500 text-white rounded-md text-center p-2 w-full">
            {success}
          </p>
        )}

        {!success && (
          // Use the native form submit handler
          <form className="w-full" onSubmit={handleSubmit}>
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
              value={email} // Use local state
              onChange={handleEmailChange} // Use local change handler
              onBlur={handleBlur} // Use local blur handler
              required
              // Added border-red-500 for error state visually
              className={`w-full p-2 mt-1 border rounded ${
                emailError ? "border-red-500" : ""
              }`}
            />

            {/* Custom InputError replacement using Tailwind */}
            {emailError && (
              <span className="text-sm text-red-500 mt-1 block">
                {emailError}
              </span>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 font-bold text-white bg-mainBlue rounded hover:bg-mainblue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
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
