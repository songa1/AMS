
// pages/change-password.tsx
"use client";

import React, {useState } from "react";


const ChangePasswordPage = () => {
  const [oldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  w-full p-10 ">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Change Password</h1>
        <form onSubmit={handleSubmit}>
        <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">
            Old Password:
          </label>
          <input
            type="password"
            id="Old-password"
            value={oldPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded"
          />
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded"
          />
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded"
          />
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
