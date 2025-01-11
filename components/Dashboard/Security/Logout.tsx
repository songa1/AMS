"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/lib/features/authSlice";
import { AUTH_STORED_DATA, getUser } from "@/helpers/auth";
import Cookies from "js-cookie";

function Logout() {
  const router = useRouter();
  const user = getUser();

  const [logout] = useLogoutMutation();

  const token = Cookies.get(AUTH_STORED_DATA?.TOKEN);

  useEffect(() => {
    const logoutFn = async () => {
      const res = await logout({ userId: user?.id, token }).unwrap();
      if (res.status === 200) {
        localStorage.removeItem(AUTH_STORED_DATA?.USER);
        Cookies.remove(AUTH_STORED_DATA?.TOKEN);
        Cookies.remove(AUTH_STORED_DATA?.USER);
        router.push("/");
      }
    };
    logoutFn();
  }, []);

  return null;
}

export default Logout;
