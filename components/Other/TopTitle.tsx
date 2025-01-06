"use client";

import React from "react";
import { Typography } from "@mui/material";

function TopTitle({ title }: { title: string }) {
  return (
    <div className="flex w-full items-center text-center">
      <Typography
        variant="h4"
        fontWeight={900}
        className="text-center py-3 px-1"
      >
        {title}
      </Typography>
    </div>
  );
}

export default TopTitle;
