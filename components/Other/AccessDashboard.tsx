"use client";

import { isAuthenticated } from "@/helpers/auth";
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
