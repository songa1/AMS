"use client";

import React from "react";
import Cohorts from "./Data/Cohorts";
import Tracks from "./Data/Tracks";
import WorkingSector from "./Data/WorkingSector";
import NotificationSetup from "./Data/NotificationSetup";

function DataNeededPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-bold mt-3 text-2xl py-3">Setup Notifications</h2>
        <NotificationSetup />
      </div>
      <div>
        <h2 className="font-bold text-2xl py-3">Cohorts Information</h2>
        <Cohorts />
      </div>
      <div>
        <h2 className="font-bold mt-3 text-2xl py-3">Tracks Information</h2>
        <Tracks />
      </div>
      <div>
        <h2 className="font-bold mt-3 text-2xl py-3">
          Working Sector Information
        </h2>
        <WorkingSector />
      </div>
    </div>
  );
}

export default DataNeededPage;
