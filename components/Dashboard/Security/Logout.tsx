"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/lib/features/authSlice";
import { AUTH_STORED_DATA, getUser } from "@/helpers/auth";
import Cookies from "js-cookie";
import Loading from "@/app/loading";

function Logout() {
  const router = useRouter();
  const user = getUser();
  const [loading, setLoading] = React.useState(false);

  const [logout] = useLogoutMutation();

  const token = Cookies.get(AUTH_STORED_DATA?.TOKEN);

  useEffect(() => {
    const logoutFn = async () => {
      setLoading(true);
      const res = await logout({ userId: user?.id, token }).unwrap();
      if (res.status === 200) {
        localStorage.removeItem(AUTH_STORED_DATA?.USER);
        Cookies.remove(AUTH_STORED_DATA?.TOKEN);
        Cookies.remove(AUTH_STORED_DATA?.USER);
        router.push("/");
      }
      setLoading(false);
    };
    logoutFn();
  }, [token, user, logout, router]);

  if (loading) {
    return <Loading />;
  }

  return null;
}

export default Logout;
