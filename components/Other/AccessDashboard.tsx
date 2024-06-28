"use client";

import { getUser, isAuthenticated } from "@/helpers/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AccessDashboard = ({ children }: { children: any }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  return <>{children}</>;
};

export const OnlyAdmin = ({ children }: { children: any }) => {
  const router = useRouter();
  const user = getUser();

  const isAdmin = user?.role?.name == "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard/profile");
    }
  }, [router, isAdmin]);

  return <>{children}</>;
};
