"use client";

import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "react-quill/dist/quill.snow.css";
import {
  useNotSetupsQuery,
  useUpdateSetupMutation,
} from "@/lib/features/notificationSlice";
import dynamic from "next/dynamic";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { SectionTitle } from "@/components/Other/TopTitle";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export const notificationTypes = {
  SIGNUP: "signup",
  UPDATE: "updated",
  UPDATED: "updated",
};

export const actionOptions = [
  {
    id: "confirm",
    action: "Confirm to update",
    color: "primary",
    click: () => (globalThis.location.href = "/dashboard/update-profile"),
  },
  {
    id: "decline",
    action: "No need to update",
    color: "error",
    click: () =>
      alert(
        "Thank you for confirming that your profile is already updated! Yo do not need to take any action for now!"
      ),
  },
  {
    id: "login",
    action: "Login",
    color: "primary",
    click: () => (globalThis.location.href = "/"),
  },
  {
    id: "reset",
    action: "Reset Your Password",
    color: "warning",
    click: () => (globalThis.location.href = "/dashboard/change-password"),
  },
  {
    id: "view",
    action: "View Your Profile",
    color: "primary",
    click: () => (globalThis.location.href = "/dashboard/profile"),
  },
];

function NotificationSetup() {
  dayjs.extend(relativeTime);
  const [notifications, setNotifications] = useState<any>([]);
  const [notification, setNotification] = useState<any>();
  const [message, setMessage] = useState<string>("");
  const [actions, setActions] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const OnActionChange = (e: any) => {
    let _actions = [...actions];

    if (e.target.checked) {
      if (!_actions.includes(e.target.value)) {
        _actions.push(e.target.value);
      }
    } else {
      _actions = _actions.filter((action) => action !== e.target.value);
    }

    setActions(_actions);
  };

  const { data: SetupData, refetch: AllRefetch } = useNotSetupsQuery("");
  const [updateSetup] = useUpdateSetupMutation();

  useEffect(() => {
    if (SetupData) {
      setNotifications(SetupData?.data);
      setNotification(SetupData?.data[0]);
    }
  }, [SetupData]);

  // const formik = useFormik({
  //   initialValues: {
  //     message: notification?.message
  //       ? notification?.message
  //       : "Add the notification here",
  //     usage: notification?.usage,
  //     link: actions.length > 0 ? actions.join("+") : "",
  //   },
  //   validationSchema: Yup.object({}),
  // });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await updateSetup({
        message: message,
        usage: notification?.usage,
        link: actions.length > 0 ? actions.join("+") : "",
      }).unwrap();

      if (res) {
        AllRefetch();
        setSuccess("Notification updated successfully!");
      }
    } catch (error: any) {
      console.log(error);
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNotification = async (id: string) => {
    setNotification(notifications.find((noti: any) => noti?.id == id));
    setMessage(notification?.message);
    setActions(notification?.link ? notification?.link.split("+") : []);
  };

  return (
    <div className="data-hold">
      <div className="notifications-left">
        <SectionTitle title="Notification Type" />
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="filled" severity="success">
            {success}
          </Alert>
        )}
        <List
          className="flex flex-col gap-1"
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Choose a notification to edit
            </ListSubheader>
          }
        >
          {notifications ? (
            notifications.map((noti: any, index: number) => {
              return (
                <ListItemButton
                  key={index + 1}
                  selected={noti == notification}
                  onClick={() => handleOpenNotification(noti?.id)}
                >
                  <ListItemText
                    primary={noti.usage}
                    secondary={dayjs(noti?.updatedAt).fromNow()}
                  ></ListItemText>
                </ListItemButton>
              );
            })
          ) : (
            <Typography
              variant="body2"
              sx={{ padding: "10px", textAlign: "center" }}
            >
              No Notifications for Now! Check back later!
            </Typography>
          )}
        </List>
      </div>
      <div className="notifications-right">
        <div className="noti-sticky-header">
          {notification ? (
            <div className="flex justify-between items-center w-full p-4">
              <Typography variant="h6" fontWeight={700}>
                {notification?.usage}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleSubmit()}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : (
            <Typography variant="h6" fontWeight={700}>
              No notification selected!
            </Typography>
          )}
        </div>
        {notification ? (
          <div className="p-5">
            <Typography variant="h5" fontWeight={700} className="py-2">
              Message:
            </Typography>
            <ReactQuill
              className="w-full rounded-md h-[30vh] mb-11"
              theme="snow"
              defaultValue={
                notification?.message
                  ? notification?.message
                  : "Add the notification here"
              }
              value={message}
              onChange={(e) => setMessage(e)}
            />
            <Typography variant="h5" fontWeight={700} className="py-2">
              Action:
            </Typography>
            <Box className="flex flex-wrap justify-content-center gap-3 p-3">
              {actionOptions.length > 0 ? (
                actionOptions.map((action: any) => (
                  <FormGroup
                    key={action.action}
                    className="flex align-items-center"
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={action.id}
                          value={action.id}
                          onChange={OnActionChange}
                          checked={actions.includes(action.id)}
                        />
                      }
                      label={action?.action}
                    />
                  </FormGroup>
                ))
              ) : (
                <Typography variant="body2">
                  No actions at the moment
                </Typography>
              )}
            </Box>
          </div>
        ) : (
          <Typography variant="body2" className="p-3" fontWeight={700}>
            {"No notification selected!"}
          </Typography>
        )}
      </div>
    </div>
  );
}

export default NotificationSetup;
