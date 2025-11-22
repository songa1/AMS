"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useImportUsersMutation } from "@/lib/features/userSlice";

const acceptedCSVTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const TailwindSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

const Notification = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-red-100 border-red-400 text-red-700";
  const title = type === "success" ? "Success" : "Error";

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg border-l-4 ${bgColor} z-[60] transition-opacity duration-300`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <strong className="font-bold mr-2">{title}:</strong>
        <p className="text-sm">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-700 hover:text-gray-900 font-bold leading-none text-2xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

const FullScreenModal = ({
  isOpen,
  setIsOpen,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  refetch: () => void;
}) => {
  const [importUsers] = useImportUsersMutation();
  const [isLoading, setIsLoading] = useState(false);

  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: "success" | "error" }[]
  >([]);

  const addNotification = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 10000); // Notifications disappear after 10 seconds
  };

  // Function to remove a notification
  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
    // Clear notifications when closing the modal
    setNotifications([]);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) &&
      isOpen
    ) {
      toggleModal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden"); // Use Tailwind approach for body overflow
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Handler for file selection and API call
  const handleFileUpload = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    let file: File | undefined;

    // Check if the event is from the file input (change) or button (click)
    if ("target" in event && event.target instanceof HTMLInputElement) {
      file = event.target.files?.[0];
    } else {
      // If the event is a button click, we need to manually find the file input's value.
      // For simplicity and better UX, it's best practice to process the file directly
      // when it's selected (the change event). We'll keep the button logic as is
      // but note that the file is only available on the change event.
      // In a real-world scenario, you'd track the selected file in state.
      // Since we cannot read the file from the button click, we assume the file is
      // selected and stored in the input element's files property if the button is clicked.
      // We'll rely on the input's onChange event for actual file processing.
      // Let's add an explicit state for the selected file to handle this.
    }

    // Reworking handleFileUpload to use a dedicated file state for better clarity:
    const fileInput = document.getElementById(
      "user-upload-file"
    ) as HTMLInputElement;
    file = fileInput?.files?.[0];

    if (!file) {
      addNotification("Please select a file first.", "error");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await importUsers(formData).unwrap();
      console.log(res);

      let totalErrors = 0;
      if (res.errors && res.errors.length > 0) {
        totalErrors = res.errors.length;
        // Display specific errors as notifications
        res.errors.forEach((err: any) => {
          addNotification(
            `Row: ${err?.row?.["Email Address"] || "N/A"}. ${err?.message}`,
            "error"
          );
        });
      }

      if (res.processedUsers && res.processedUsers.length > 0) {
        addNotification(
          `${res.processedUsers.length} user(s) processed successfully.`,
          "success"
        );
      } else if (totalErrors === 0) {
        // Case where file was processed but no users were added (e.g., empty file or no valid data)
        addNotification(
          "File processed, but no valid users were added.",
          "error"
        );
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.data?.message || "An unknown error occurred during import.";
      addNotification(`Import failed: ${errorMessage}`, "error");
    } finally {
      refetch();
      setIsLoading(false);
      toggleModal(); // Close modal on completion (success or failure)
      // Clear the file input after processing/closing
      if (fileInput) fileInput.value = "";
    }
  };

  // Note: The original component calls handleFileUpload on *both* input change
  // and button click. This is unusual and typically leads to processing twice
  // if the button is clicked after selecting a file. I will simplify the UX
  // by having the button trigger the processing of the already selected file.
  // The input's onChange will only ensure a file is selected.

  // We'll simplify the file input's onChange to just check for a file, and
  // keep the main logic on the button click.

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    // This is where you would normally store the selected file in component state,
    // but given the original pattern, we'll just ensure the input is clear for the next attempt.
    if (event.target.files && event.target.files.length > 0) {
      // Optionally show a preview or file name feedback
    }
  };

  if (!isOpen) {
    return null;
  }

  // Use createPortal to render the modal outside the main component hierarchy
  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm z-40"
        onClick={toggleModal}
      ></div>

      {/* Notifications container */}
      <div className="fixed top-0 right-0 p-4 space-y-2 z-50">
        {notifications.map((n) => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          {/* Close Button (X icon) */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors"
            onClick={toggleModal}
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            <span className="text-xs block mt-[-4px]">(Esc)</span>
          </button>

          {/* Modal Header */}
          <div className="pb-4 border-b border-gray-200 mb-6">
            <h2 className="text-3xl font-extrabold text-blue-600">
              Upload Users
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Use an Excel (.xlsx) file with user data.
            </p>
          </div>

          {/* File Upload Area */}
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-300 rounded-lg shadow-inner bg-gray-50 mb-6">
            <input
              id="user-upload-file"
              type="file"
              className="w-full md:w-auto p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
              onChange={handleFileSelect}
              accept={acceptedCSVTypes.join(",")}
            />
            <button
              title={isLoading ? "Processing..." : "Import Users"}
              onClick={handleFileUpload}
              disabled={isLoading}
              className={`mt-4 md:mt-0 py-2 px-6 rounded-lg font-semibold ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            />
          </div>

          <div className="min-h-[100px] flex items-center justify-center">
            {isLoading && (
              <div className="p-10">
                <TailwindSpinner />
              </div>
            )}
            {!isLoading && (
              <p className="text-gray-500 italic text-center">
                Please select your Excel file and click 'Import Users'.
              </p>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default FullScreenModal;
