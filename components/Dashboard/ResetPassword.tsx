"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useChangePasswordMutation } from "@/lib/features/authSlice";
import { AUTH_STORED_DATA, getUser } from "@/helpers/auth";
import Cookies from "js-cookie";
// Assuming TopTitle is a custom component that uses Tailwind
import TopTitle from "../Other/TopTitle";

interface PasswordState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initialPasswordState: PasswordState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// --- Custom Input Field Component for Password ---
interface PasswordInputFieldProps {
  id: keyof PasswordState;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string;
  autoComplete: string;
}

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
}) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type="password"
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      className={`p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out bg-white/70 shadow-sm w-full
        ${error ? "border-red-500" : "border-gray-300"}
      `}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// --- Main Component ---
const ChangePasswordPage = () => {
  const [formData, setFormData] = useState<PasswordState>(initialPasswordState);
  const [errors, setErrors] = useState<Partial<PasswordState>>({});
  const [message, setMessage] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = getUser();
  const [changePassword] = useChangePasswordMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when typing
    if (errors[name as keyof PasswordState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setGlobalError("");
    setMessage("");
  };

  const validate = (): boolean => {
    let tempErrors: Partial<PasswordState> = {};
    let isValid = true;

    if (!formData.oldPassword) {
      tempErrors.oldPassword = "Old password is required";
      isValid = false;
    }

    if (!formData.newPassword || formData.newPassword.length < 8) {
      tempErrors.newPassword =
        "New password must be at least 8 characters long";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm the new password";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords must match";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    setMessage("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // The API call structure based on your original code:
      const result = await changePassword({
        userId: user?.id,
        pastPassword: formData.oldPassword,
        password: formData.newPassword,
      }).unwrap();

      if (result?.status === 200) {
        setMessage("Password changed successfully. Logging out...");
        // Handle successful password change and forced logout
        Cookies.remove(AUTH_STORED_DATA.TOKEN);
        Cookies.remove(AUTH_STORED_DATA.USER);
        setTimeout(() => {
          globalThis.location.href = "/";
        }, 1500);
      } else {
        // Handle unexpected success payload (if not 200)
        setGlobalError(result?.message || "Password change failed.");
      }
    } catch (error: any) {
      console.error("Change password error:", error);
      const errorMessage =
        error?.data?.error ||
        "Incorrect old password or a server error occurred.";

      if (error?.status === 401) {
        setErrors((prev) => ({ ...prev, oldPassword: errorMessage }));
      } else {
        setGlobalError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <TopTitle title="Change Password" />

        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <PasswordInputField
              id="oldPassword"
              label="Old Password"
              value={formData.oldPassword}
              onChange={handleChange}
              error={errors.oldPassword || ""}
              autoComplete="current-password"
            />

            <PasswordInputField
              id="newPassword"
              label="New Password (min 8 characters)"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword || ""}
              autoComplete="new-password"
            />

            <PasswordInputField
              id="confirmPassword"
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword || ""}
              autoComplete="new-password"
            />

            {/* Status Messages */}
            {message && (
              <p className="mt-2 p-3 text-sm font-medium bg-green-100 text-green-700 rounded-lg">
                ✅ {message}
              </p>
            )}
            {globalError && (
              <p className="mt-2 p-3 text-sm font-medium bg-red-100 text-red-700 rounded-lg">
                ❌ {globalError}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full px-4 py-3 mt-4 font-bold text-white rounded-lg transition duration-200 shadow-lg
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300"
                }
              `}
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
