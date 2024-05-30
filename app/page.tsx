"use client";

import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (

    <div className="flex h-screen lg:inline ">

      <div className="w-full lg:w -1/1 flex flex-col  justify-center items-center">

        <div className="bg-mainBlue w-full p-5">
          <h2 className="text-white text-center text-3xl font-extrabold text-gray-900">
            ALMINI MANAGEMENT SYSTEM!
          </h2>
        </div>
        <div className="max-w-md w-full space-y-8 mt-20" >
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
            
            <Link href="/forgotpassword" className='mt-70 pt-25 item-left text-yellow'>Forgot Password?</Link>
            
            <div>
              <button
                type="submit"
                className="w-full bg-mainBlue text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

