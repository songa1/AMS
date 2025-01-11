import { Box, CircularProgress } from "@mui/material";
import React from "react";

function Loading() {
  return (
    <Box className="h-screen w-full flex justify-center items-center z-50">
      <CircularProgress />
    </Box>
  );
}

export default Loading;
