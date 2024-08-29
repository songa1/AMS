import Cookies from "js-cookie";

export enum AUTH_STORED_DATA {
  TOKEN = "token",
  USER = "user",
}

export const isAuthenticated = () => {
  return (
    Cookies.get(AUTH_STORED_DATA?.TOKEN) && Cookies.get(AUTH_STORED_DATA?.USER)
  );
};

// export const getUser = () => {
//   const user: any = Cookies.get(AUTH_STORED_DATA?.USER);
//   return user ? JSON.parse(user) : null;
// };

export const getUser = () => {
  const user =
    typeof window !== "undefined"
      ? localStorage.getItem(AUTH_STORED_DATA?.USER)
      : null;
  return user ? JSON.parse(user) : null;
};

export const token = () => Cookies.get(AUTH_STORED_DATA?.TOKEN);
