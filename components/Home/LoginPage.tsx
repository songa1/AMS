"use client";

import { useLoginMutation } from "@/lib/features/authSlice";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CustomInputError } from "../ui/input-error";

// Placeholder for Header (Replaces original Header)
const SimpleHeader = () => (
  <div className="text-center mb-8">
    <div className="inline-flex items-center space-x-2 p-3 rounded-xl bg-indigo-600 shadow-lg">
      {/* Simple App Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-white"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 110-6 3 3 0 010 6z" />
      </svg>
      <h1 className="text-2xl font-extrabold text-white tracking-wider font-sans">
        APP NAME
      </h1>
    </div>
  </div>
);

const AUTH_STORED_DATA = {
  USER: "auth_user_data",
  TOKEN: "auth_token",
};

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!credentials.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = "Invalid Email format";
      isValid = false;
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(credentials).unwrap();

      localStorage.setItem(
        AUTH_STORED_DATA?.USER,
        JSON.stringify(result?.user)
      );
      Cookies.set(AUTH_STORED_DATA?.TOKEN, result?.token, { expires: 7 });
      Cookies.set(AUTH_STORED_DATA?.USER, JSON.stringify(result?.user), {
        expires: 7,
      });

      if (result?.status === 200) {
        if (result?.user?.role?.name === "ADMIN") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/dashboard/profile";
        }
      }
    } catch (err) {
      // const errorData = err?.data || {};
      // if (err?.status === 401 && errorData.error) {
      //   setGeneralError(errorData.error);
      // } else {
      //   setGeneralError("An unexpected error occurred. Please try again.");
      // }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (generalError) {
      const timer = setTimeout(() => {
        setGeneralError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [generalError]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 transition duration-500 ease-in-out hover:shadow-xl">
        <SimpleHeader />

        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error Alert */}
          {generalError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative transition-all duration-300 shadow-md"
              role="alert"
            >
              <span className="block sm:inline">{generalError}</span>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
              placeholder="you@example.com"
            />
            <CustomInputError error={errors.email} />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Password
              </label>
              <a
                href="/forgotpassword" // Using standard anchor for Link replacement
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
              placeholder="••••••••"
            />
            <CustomInputError error={errors.password} />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 transform active:scale-95 ${
                isLoading ? "opacity-70 cursor-not-allowed bg-indigo-500" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a
          href="/register"
          className="font-medium text-indigo-600 hover:text-indigo-500 transition"
        >
          Sign up
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
