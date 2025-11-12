"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useNotSetupsQuery,
  useUpdateSetupMutation,
} from "@/lib/features/notificationSlice";
import { ToastNotification } from "../ui/toast";
import { CustomButton } from "../ui/button1";

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
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  dayjs.extend(relativeTime);
  const [notifications, setNotifications] = useState<any>([]);
  const [currentNotificationId, setCurrentNotificationId] = useState<
    string | undefined
  >();
  const [selectedNotification, setSelectedNotification] = useState<any>();

  // Form states replacing Formik.values
  const [message, setMessage] = useState("");
  const [usage, setUsage] = useState(""); // This value seems derived from the selected notification
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);

  const { data: SetupData, refetch: AllRefetch } = useNotSetupsQuery("");
  const [updateSetup, { isLoading }] = useUpdateSetupMutation();

  const handleCloseToast = () => setToast(null);

  // 1. Initial Data and Notification Setup
  useEffect(() => {
    if (SetupData && SetupData.data && SetupData.data.length > 0) {
      setNotifications(SetupData.data);
      // Select the first notification on initial load
      const firstNotiId = SetupData.data[0].id;
      setCurrentNotificationId(firstNotiId);
      setSelectedNotification(
        SetupData.data.find((n: any) => n.id === firstNotiId)
      );
    }
  }, [SetupData]);

  // 2. Update form fields when selected notification changes
  useEffect(() => {
    if (selectedNotification) {
      setMessage(selectedNotification.message || "Add the notification here");
      setUsage(selectedNotification.usage || "");

      // Parse link string into action IDs
      const linkIds = selectedNotification.link
        ? selectedNotification.link.split("+")
        : [];
      setSelectedActionIds(linkIds);
    }
  }, [selectedNotification]);

  // 3. Update selected notification when ID changes
  useEffect(() => {
    if (currentNotificationId && notifications.length > 0) {
      const noti = notifications.find(
        (noti: any) => noti.id === currentNotificationId
      );
      setSelectedNotification(noti);
    }
  }, [currentNotificationId, notifications]);

  const handleOpenNotification = (id: string) => {
    setCurrentNotificationId(id);
  };

  // Custom Action Change Handler
  const OnActionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    actionId: string
  ) => {
    setSelectedActionIds((prevActions) => {
      let newActions = [...prevActions];

      if (e.target.checked) {
        if (!newActions.includes(actionId)) {
          newActions.push(actionId);
        }
      } else {
        newActions = newActions.filter((id) => id !== actionId);
      }
      return newActions;
    });
  };

  // Custom Submission Logic (Replacing Formik.handleSubmit)
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentNotificationId) {
      setToast({
        type: "error",
        message: "Please select a notification to update.",
      });
      return;
    }

    try {
      const res = await updateSetup({
        id: currentNotificationId, // Send the ID of the notification being updated
        message: message,
        usage: usage, // usage might not need to be sent if it's not editable, but keeping for safety
        link: selectedActionIds.join("+"),
      }).unwrap();

      if (res) {
        AllRefetch();
        setToast({
          type: "success",
          message: "Notification updated successfully!",
        });
      }
    } catch (error: any) {
      console.error("Update error:", error);
      setToast({
        type: "error",
        message: error?.data?.message || "An error occurred while updating.",
      });
    }
  };

  // Find the currently selected notification for the header display
  const currentNotiHeader = selectedNotification
    ? selectedNotification.usage
    : "No notification selected!";

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <ToastNotification
        type={toast?.type || "info"}
        message={toast?.message || ""}
        onClose={handleCloseToast}
      />

      <div className="flex flex-col lg:flex-row gap-6 h-[85vh]">
        {/* Left Section: Notification List */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-lg border border-gray-100 overflow-y-auto flex-shrink-0">
          <h1 className="sticky top-0 bg-white p-4 text-xl font-bold text-gray-800 border-b z-10">
            Notification Type
          </h1>
          <ul className="flex flex-col">
            {notifications.length > 0 ? (
              notifications.map((noti: any, index: number) => (
                <li
                  key={noti.id || index}
                  className={`border-b border-gray-100 p-3 px-4 cursor-pointer transition duration-150 ${
                    currentNotificationId === noti.id
                      ? "bg-indigo-100 border-l-4 border-indigo-600 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleOpenNotification(noti.id)}
                >
                  <div>
                    <p className="text-xs text-indigo-600 mb-1">
                      {dayjs(noti?.updatedAt).fromNow()}
                    </p>
                    <p className="text-sm text-gray-700">{noti.usage}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="py-4 px-2 text-center text-sm text-gray-500 italic">
                No Notifications for Now! Check back later!
              </p>
            )}
          </ul>
        </div>

        {/* Right Section: Notification Editor */}
        <div className="lg:w-2/3 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col">
          <div className="sticky top-0 bg-white p-4 border-b z-10">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-bold text-gray-800">
                {currentNotiHeader}
              </h2>
              <CustomButton
                onClick={handleSubmit}
                disabled={isLoading || !currentNotificationId}
              >
                {isLoading ? "Saving..." : "Save"}
              </CustomButton>
            </div>
          </div>

          {selectedNotification ? (
            <div className="p-5 overflow-y-auto">
              {/* Message Editor */}
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Message:
                </label>
                {/* Assuming simple textarea replacement for Rich Text Editor */}
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg h-40 resize-y focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="Add the notification message here..."
                />
              </div>

              {/* Action Checkboxes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Actions:
                </label>
                <div className="flex flex-wrap gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {actionOptions.length > 0 ? (
                    actionOptions.map((action: any) => (
                      <div key={action.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={action.id}
                          name={action.id}
                          value={action.id} // Use ID for value in refactored logic
                          onChange={(e) => OnActionChange(e, action.id)}
                          checked={selectedActionIds.includes(action.id)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={action.id}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {action.action}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No actions available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-grow p-10 text-gray-500 italic">
              Select a notification type from the list to begin editing its
              content and actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationSetup;
