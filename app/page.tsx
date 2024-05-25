"use client";

import Link from "next/link";
import React from "react";

// function page() {
//   return (
//     <div>
//       <Link href="/dashboard">Login</Link>
      

//     </div>
//   );
// }

// export default page;
// components/LoginPage.tsx
const LoginPage = () => {
  return (
    <>
    <div className="title lg:block w-full bg-blue-500 text-white flex justify-center items-center text-center">

      <h1>ALMNI MANAGEMENT SYSTEM</h1>
    </div>
    <div className="flex h-screen lg:inline ">
        {/* Left Section - Logo and Image */}
        <div className="hidden lg:block w-1/2 bg-white-500 text-white flex justify-center items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4 ">Your Logo</h1>
            <img src="your-image-url.jpg" alt="Your Image" className="rounded-lg" />
          </div>
        </div>

        {/* Right Section - Login Credentials */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Welcome back!
              </h2>
            </div>
            <form className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="Enter your email address" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password:
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="Enter your password" />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </>
  );
};

export default LoginPage;

