"use client";

import React from "react";
import { Typography } from "@mui/material";

export function SectionTitle({ title }: { title: string }) {
  return (
    <Typography
      variant="h6"
      sx={{
        padding: "10px",
        textAlign: "center",
        backgroundColor: "white",
        fontWeight: 900,
      }}
      color="primary"
      className="border-b border-gray-100"
    >
      {title}
    </Typography>
  );
}

export function OtherTitle({ title }: { title: string }) {
  return (
    <div className="flex w-full items-center text-center">
      <Typography
        variant="h5"
        fontWeight={800}
        className="text-center py-3 px-1"
      >
        {title}
      </Typography>
    </div>
  );
}

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
