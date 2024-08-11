"use client";

import { getUser, isAuthenticated } from "@/helpers/auth";
import { useEffect } from "react";

export const AccessDashboard = ({ children }: { children: any }) => {
  useEffect(() => {
    // if (!isAuthenticated()) {
    //   globalThis.location.href = "/";
    // }
  }, []);

  return <>{children}</>;
};

export const OnlyAdmin = ({ children }: { children: any }) => {
  const user = getUser();

  const isAdmin = user?.role?.name == "ADMIN";

  useEffect(() => {
    // if (!isAdmin) {
    //   globalThis.location.href = "/dashboard/profile";
    // }
  }, [isAdmin]);

  return <>{children}</>;
};
