// ConfirmModal.tsx - Modernized Version
"use client";

import React from "react";
import { MdWarning, MdClose } from "react-icons/md";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  closeModal: () => void;
  action: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean;
}

const ModalButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant: "confirm" | "cancel";
  disabled?: boolean;
}> = ({ children, onClick, variant, disabled = false }) => {
  const baseStyle =
    "px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm";

  if (variant === "confirm") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyle} bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70`}
    >
      {children}
    </button>
  );
};

function ConfirmModal({
  closeModal,
  action,
  title,
  description,
  confirmText,
  cancelText,
  isLoading = false,
}: ConfirmModalProps) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      ></div>

      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8">
        {/* Close Button (for desktop UX) */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <MdClose className="w-6 h-6" />
        </button>

        <div className="bg-white p-6 sm:p-8">
          <div className="flex items-start">
            {/* Icon (Attention grabbing) */}
            <div className="mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 border border-red-300">
              <MdWarning className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>

            {/* Content */}
            <div className="mt-0 text-left sm:ml-4">
              <h3
                className="text-xl font-bold leading-6 text-gray-900 mb-2"
                id="modal-title"
              >
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Modern Footer) */}
        <div className="bg-gray-50 flex justify-end gap-3 px-6 py-4 rounded-b-xl">
          <ModalButton
            onClick={closeModal}
            variant="cancel"
            disabled={isLoading}
          >
            {cancelText}
          </ModalButton>

          <ModalButton onClick={action} variant="confirm" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {confirmText.replace(/\.+$/, "")}...
              </span>
            ) : (
              confirmText
            )}
          </ModalButton>
        </div>
      </div>
    </div>,
    document.body // Portal target
  );
}

export default ConfirmModal;
