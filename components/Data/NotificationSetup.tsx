"use client";

import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import { Toast } from "primereact/toast";
import relativeTime from "dayjs/plugin/relativeTime";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useNotSetupsQuery,
  useUpdateSetupMutation,
} from "@/lib/features/notificationSlice";
import Button from "../Other/Button";
import { Checkbox } from "primereact/checkbox";

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
  const toast: any = useRef(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  dayjs.extend(relativeTime);
  const [notifications, setNotifications] = useState<any>([]);
  const [currentNotification, setCurrentNotification] = useState<string>();
  const [notification, setNotification] = useState<any>();
  const [actions, setActions] = useState<any[]>([]);

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
  }, [currentNotification, notifications]);

  const handleOpenNotification = async (id: string) => {
    console.log(id);
    setCurrentNotification(id);
    if (notification) {
      formik.setValues({
        ...formik.values,
        message: notification.message,
        usage: notification.usage,
        link: notification.link,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      message: "Add the notification here",
      usage: notification?.usage,
      link: actions.map((action) => action.id).join("+"),
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      try {
        const res = await updateSetup({
          message: values.message,
          usage: values.usage,
          link: values.link,
        }).unwrap();

        if (res) {
          AllRefetch();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Notification updated successfully!",
          });
        }
      } catch (error: any) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error",
        });
      }
    },
  });

  return (
    <div>
      <Toast ref={toast}></Toast>
      <div className="data-hold">
        <div className="notifications-left">
          <h1 className="noti-sticky-header">Notification Type</h1>
          <ul className="flex flex-col gap-1">
            {notifications.length > 0 ? (
              notifications.map((noti: any, index: number) => (
                <li
                  key={index + 1}
                  className="border-b border-gray-200 p-2 px-4 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleOpenNotification(noti?.id)}
                >
                  <div>
                    <p className="text-xs text-mainBlue">
                      {dayjs(noti?.updatedAt).fromNow()}
                    </p>
                    <p>{noti.usage}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="py-4 px-2 text-center text-xs">
                No Notifications for Now! Check back later!
              </p>
            )}
          </ul>
        </div>
        <div className="notifications-right">
          <div className="noti-sticky-header">
            <div className="flex justify-between items-center w-full p-2">
              <div>
                {currentNotification
                  ? `${
                      notifications.find(
                        (noti: any) => noti.id == currentNotification
                      )?.usage
                    }`
                  : "No notification selected!"}
              </div>
              <Button title="Save" onClick={formik.handleSubmit} />
            </div>
          </div>
          <div className="p-5">
            <label className="py-2">
              <b>Message:</b>
            </label>
            <ReactQuill
              className="w-full bg-gray-100 rounded-md h-[30vh] mb-11"
              theme="snow"
              defaultValue={
                notification?.message || "Add the notification here"
              }
              value={formik.values.message}
              onChange={(e) => formik.setFieldValue("message", e)}
            />
            <label className="py-2">
              <b>Action:</b>
            </label>
            <div className="flex flex-wrap justify-content-center gap-3 p-3">
              {actionOptions.length > 0 ? (
                actionOptions.map((action: any) => (
                  <div key={action.action} className="flex align-items-center">
                    <input
                      type="checkbox"
                      name={action.id}
                      value={action.action}
                      onChange={OnActionChange}
                      checked={actions && actions.includes(action.action)}
                    />
                    <label htmlFor={action.id} className="ml-2">
                      {action.action}
                    </label>
                  </div>
                ))
              ) : (
                <p>No actions at the moment</p>
              )}
            </div>
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}

export default NotificationSetup;
