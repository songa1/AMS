"use client";

import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const AuthProvider = ({ children }: Props) => {
  return children;
};

export default AuthProvider;
