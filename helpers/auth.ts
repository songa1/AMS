import { getCookie } from "cookies-next";

export enum AUTH_STORED_DATA {
  TOKEN = "auth_token",
  USER = "auth_user_data",
}

export const isAuthenticated = () => {
  return (
    getCookie(AUTH_STORED_DATA?.TOKEN) && getCookie(AUTH_STORED_DATA?.USER)
  );
};

export const getUser = () => {
  const user =
    typeof window !== "undefined"
      ? localStorage.getItem(AUTH_STORED_DATA?.USER)
      : null;
  return user ? JSON.parse(user) : null;
};

export const getCookieUser = () => {
  const user: any = getCookie(AUTH_STORED_DATA?.USER);
  return user ? JSON.parse(user) : null;
};

export const token = () => getCookie(AUTH_STORED_DATA?.TOKEN);
