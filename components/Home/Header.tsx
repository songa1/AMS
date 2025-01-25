"use client";

import { Box, Typography } from "@mui/material";
import React from "react";

function Header() {
  return (
    <Box
      sx={{
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <img alt="YALI Logo" src="/yali.png" width={150} />
      <Typography
        variant="h6"
        className="text-center text-mainBlue"
        fontWeight={600}
      >
        ALUMNI MANAGEMENT SYSTEM
      </Typography>
    </Box>
  );
}

export default Header;
