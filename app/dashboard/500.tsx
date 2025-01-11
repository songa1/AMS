"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";

function ServerError() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Typography variant="h1" color="error" gutterBottom>
        500
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Oops! Something went wrong on our end.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Please try again later or return to the homepage.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoBack}
        size="large"
      >
        Go to Homepage
      </Button>
    </Box>
  );
}

export default ServerError;
