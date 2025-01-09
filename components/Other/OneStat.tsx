"use client";

import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { BsEye } from "react-icons/bs";

function OneStat({
  title,
  numbers,
  icon,
  link,
}: {
  title: string;
  numbers: number;
  icon: any;
  link: string;
}) {
  return (
    <Card>
      <CardActionArea
        sx={{
          height: "100%",
          "&[data-active]": {
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: "action.selectedHover",
            },
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <CardContent sx={{ height: "100%" }}>
          {icon}
          <div>
            <Typography
              color="primary"
              variant="h3"
              component="div"
              fontWeight={800}
            >
              {numbers}
            </Typography>
            <Typography variant="p">{title}</Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default OneStat;
