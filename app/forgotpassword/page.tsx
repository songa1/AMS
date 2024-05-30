"use client"

import ForgotPasswordPage from "@/components/Dashboard/ForgotPassword ";
import React from 'react';

function page() {
    return (
        <div>
             <div className="bg-mainBlue w-full p-5">
          <h2 className="text-white text-center text-3xl font-extrabold text-gray-900">
            ALMINI MANAGEMENT SYSTEM!
          </h2>
        </div>
            <ForgotPasswordPage />
        </div>
    );
}

export default page;