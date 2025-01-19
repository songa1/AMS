"use client";

import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
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
  },
  { id: "decline", action: "Decline to update" },
  { id: "login", action: "Login" },
];

function NotificationSetup() {
  dayjs.extend(relativeTime);
  const [notifications, setNotifications] = useState<any>([]);
  const [currentNotification, setCurrentNotification] = useState<string>();
  const [notification, setNotification] = useState<any>();
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
    console.log(formik.values);

    formik.setValues({
      ...formik.values,
      link: _actions.map((action) => action.id).join("+"),
    });
  };

  const { data: SetupData, refetch: AllRefetch } = useNotSetupsQuery("");
  const [updateSetup] = useUpdateSetupMutation();

  useEffect(() => {
    if (SetupData) {
      setNotifications(SetupData?.data);
      setCurrentNotification(SetupData?.data[0].id);
    }
    if (notification) {
      formik.setValues({
        ...formik.values,
        message: notification.message,
        usage: notification.usage,
      });
    }
  }, [SetupData, notification]);

  useEffect(() => {
    if (currentNotification) {
      setNotification(
        notifications.find((noti: any) => noti.id == currentNotification)
      );
    }

    if (notification) {
      formik.setValues({
        ...formik.values,
        message: notification.message,
        usage: notification.usage,
      });
    }
  }, [currentNotification, notification, notifications]);

  const handleOpenNotification = async (id: string) => {
    setCurrentNotification(id);
    setNotification(
      notifications.find((noti: any) => noti.id == currentNotification)
    );
    console.log(
      "Notification: ",
      notification,
      "NotificationID",
      currentNotification
    );
    if (notification) {
      formik.setValues({
        message: notification?.message,
        usage: notification?.usage,
        link: notification?.link,
      });
    }
    console.log(
      "Notification: ",
      notification,
      "NotificationID",
      currentNotification
    );
  };

  const formik = useFormik({
    initialValues: {
      message: notification?.message
        ? notification?.message
        : "Add the notification here",
      usage: notification?.usage,
      link: actions.map((action: any) => action.id).join("+"),
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values: any) => {
      setLoading(true);
      try {
        const res = await updateSetup({
          message: values.message,
          usage: values.usage,
          link: values.link,
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
    },
  });

  return (
    <Box className="data-hold">
      <Box className="notifications-left">
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
          {notifications.length > 0 ? (
            notifications.map((noti: any, index: number) => (
              <ListItemButton
                key={index + 1}
                selected={noti?.id == currentNotification}
                onClick={() => handleOpenNotification(noti?.id)}
              >
                <ListItemText
                  primary={noti.usage}
                  secondary={dayjs(noti?.updatedAt).fromNow()}
                ></ListItemText>
              </ListItemButton>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ padding: "10px", textAlign: "center" }}
            >
              No Notifications for Now! Check back later!
            </Typography>
          )}
        </List>
      </Box>
      <Box className="notifications-right">
        <Box className="noti-sticky-header">
          <Box className="flex justify-between items-center w-full p-4">
            <Typography variant="h6" fontWeight={700}>
              {currentNotification && notification
                ? notification?.usage
                : "No notification selected!"}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => formik.handleSubmit()}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
        <Box className="p-5">
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
            value={formik.values.message}
            onChange={(e) => formik.setFieldValue("message", e)}
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
                        aria-label=""
                        value={action.action}
                        onChange={OnActionChange}
                        checked={actions && actions.includes(action.action)}
                      />
                    }
                    label={action?.action}
                  />
                </FormGroup>
              ))
            ) : (
              <Typography variant="body2">No actions at the moment</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default NotificationSetup;
