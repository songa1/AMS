"use client";

import React from "react";
import Cohorts from "./Data/Cohorts";
import Tracks from "./Data/Tracks";
import WorkingSector from "./Data/WorkingSector";
import NotificationSetup from "./Data/NotificationSetup";
import { OtherTitle } from "@/components/Other/TopTitle";
import { Box } from "@mui/material";

function DataNeededPage() {
  return (
    <Box className="flex flex-col gap-5">
      <Box>
        <OtherTitle title="Setup Notifications" />
        {/* <NotificationSetup /> */}
      </Box>
      <Box>
        <OtherTitle title="Cohorts Information" />
        <Cohorts />
      </Box>
      <Box>
        <OtherTitle title="Tracks Information" />
        <Tracks />
      </Box>
      <Box>
        <OtherTitle title="Working Sector Information" />
        <WorkingSector />
      </Box>
    </Box>
  );
}

export default DataNeededPage;
