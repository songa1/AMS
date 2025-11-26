"use client";

import React from "react";
import {
  MdCheck,
  MdOutlineHourglassDisabled,
  MdOutlineWarning,
} from "react-icons/md";
import { Briefcase, User2, SkipForward } from "lucide-react";

interface SectionWrapperProps {
  id: number;
  title: string;
  mandatory: boolean;
  isOptional: boolean;
  currentStatus: "idle" | "success" | "error" | "skipped";
  isActive: boolean;
  isReady: boolean;
  onReactivate: (id: number) => void;
  children: React.ReactNode;
}

const CompletedState = ({
  title,
  status,
  onReactivate,
  id,
  isOptional,
}: {
  title: string;
  status: "success" | "skipped" | "error";
  onReactivate: (id: number) => void;
  id: number;
  isOptional: boolean;
}) => {
  let icon = <MdCheck className="w-6 h-6 mr-3 text-green-600" />;
  let message = `${title} successfully completed.`;
  let bgColor = "bg-green-50 border-green-200";
  if (status === "skipped") {
    icon = <SkipForward className="w-5 h-5 mr-3 text-yellow-600" />;
    message = `${title} was skipped.`;
    bgColor = "bg-yellow-50 border-yellow-200";
  } else if (status === "error") {
    icon = <MdOutlineWarning className="w-6 h-6 mr-3 text-red-600" />;
    message = `${title} failed to submit. Please retry.`;
    bgColor = "bg-red-50 border-red-200";
  }

  const isEditable = status === "skipped" || status === "error";

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl shadow-sm border ${bgColor}`}
    >
      <div className="flex items-center">
        {icon}
        <span
          className={`font-medium ${
            status === "success"
              ? "text-green-700"
              : status === "skipped"
              ? "text-yellow-700"
              : "text-red-700"
          }`}
        >
          {message}
        </span>
      </div>
      {isEditable && (
        <button
          onClick={() => onReactivate(id)}
          className="text-sm px-3 py-1 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {status === "skipped" ? "Reactivate Section" : "Retry"}
        </button>
      )}
    </div>
  );
};

const InactiveState = ({
  prevSectionId,
  title,
}: {
  prevSectionId: number;
  title: string;
}) => (
  <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
    <MdOutlineHourglassDisabled className="w-6 h-6 mr-3 text-gray-500" />
    <span className="text-gray-600">
      Please complete Section {prevSectionId} (Personal Information) before
      proceeding to {title}.
    </span>
  </div>
);

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  title,
  mandatory,
  isOptional,
  currentStatus,
  isActive,
  isReady,
  onReactivate,
  children,
}) => {
  const headerIcon =
    id === 1 ? (
      <User2 className="inline w-5 h-5 mr-2" />
    ) : (
      <Briefcase className="inline w-5 h-5 mr-2" />
    );

  if (
    currentStatus === "success" ||
    currentStatus === "skipped" ||
    currentStatus === "error"
  ) {
    if (id === 1 && currentStatus === "success") {
      return (
        <CompletedState
          title={title}
          status="success"
          onReactivate={onReactivate}
          id={id}
          isOptional={isOptional}
        />
      );
    }

    if ((id === 2 || id === 3) && currentStatus === "success") {
      return (
        <CompletedState
          title={title}
          status="success"
          onReactivate={onReactivate}
          id={id}
          isOptional={isOptional}
        />
      );
    }

    if (currentStatus === "skipped" || currentStatus === "error") {
      return (
        <CompletedState
          title={title}
          status={currentStatus}
          onReactivate={onReactivate}
          id={id}
          isOptional={isOptional}
        />
      );
    }
  }

  if (!isActive && !isReady) {
    return (
      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-400 mb-4 border-b pb-2">
          {headerIcon} {id}. {title}{" "}
          {mandatory && <span className="text-red-500">*</span>}
        </h2>
        <InactiveState prevSectionId={id - 1} title={title} />
      </section>
    );
  }

  if (isActive || (isReady && currentStatus === "idle")) {
    return (
      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-primary ring-2 ring-blue-100">
        <h2 className="text-xl font-bold text-primary mb-4 border-b pb-2">
          {headerIcon} {id}. {title}
          {mandatory && <span className="text-red-500">*</span>}
        </h2>
        {children}
      </section>
    );
  }
  return null;
};

export default SectionWrapper;
