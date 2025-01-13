"use client";

import React from "react";
import Cohorts from "./Data/Cohorts";
import Tracks from "./Data/Tracks";
import WorkingSector from "./Data/WorkingSector";
import NotificationSetup from "./Data/NotificationSetup";
import { OtherTitle } from "@/components/Other/TopTitle";

function DataNeededPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <OtherTitle title="Setup Notifications" />
        {/* <NotificationSetup /> */}
      </div>
      <div>
        <OtherTitle title="Cohorts Information" />
        <Cohorts />
      </div>
      <div>
        <OtherTitle title="Tracks Information" />
        <Tracks />
      </div>
      <div>
        <OtherTitle title="Working Sector Information" />
        <WorkingSector />
      </div>
    </div>
  );
}

export default DataNeededPage;
