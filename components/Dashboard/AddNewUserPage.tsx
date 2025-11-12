"use client";

import React, { useState } from "react";
import TopTitle from "../Other/TopTitle";
import AddPersonalInfo from "./AddMember/AddPersonalInfo";
import AddFoundedInfo from "./AddMember/AddFoundedInfo";
import AddEmployedInfo from "./AddMember/AddEmployedInfo";

export const steps = [
  "Personal Information",
  "Founded Initiative information",
  "Employment information",
];

interface CustomStepProps {
  label: string;
  index: number;
  activeStep: number;
  isSkipped: boolean;
  isCompleted: boolean;
  isOptional: boolean;
}

const CustomStep: React.FC<CustomStepProps> = ({
  label,
  index,
  activeStep,
  isSkipped,
  isCompleted,
  isOptional,
}) => {
  const isActive = index === activeStep;
  const isAfter = index < activeStep;

  // Determine circle style
  let circleStyle =
    "w-8 h-8 flex items-center justify-center rounded-full text-white font-bold transition duration-300";
  if (isCompleted || isAfter) {
    circleStyle += " bg-green-500"; // Completed/Passed
  } else if (isActive) {
    circleStyle += " bg-indigo-600 ring-4 ring-indigo-200"; // Active
  } else {
    circleStyle += " bg-gray-400"; // Pending
  }

  // Determine label style
  let labelStyle = "text-sm mt-1 transition duration-300 text-center";
  if (isActive) {
    labelStyle += " text-indigo-700 font-semibold";
  } else if (isCompleted || isAfter) {
    labelStyle += " text-gray-700";
  } else {
    labelStyle += " text-gray-500";
  }

  // Determine line style (connecting line)
  const lineStyle =
    "absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-1 bg-gray-300 transition-colors duration-300 z-0";
  const completedLineStyle = "bg-green-500";
  // The line segment for the currently active step should perhaps be half filled or transition color

  return (
    <div className="flex-1 relative">
      {/* Line connecting steps (excluding the last one) */}
      {index < steps.length - 1 && (
        <div
          className={`${lineStyle} ${isAfter ? completedLineStyle : ""}`}
          // Custom style for the active step line segment transition
          style={{
            backgroundColor: isAfter
              ? "#10B981"
              : isActive
                ? "#A5B4FC"
                : "#D1D5DB",
            // Optional: If you wanted a progressive fill:
            // width: isActive ? '50%' : '100%',
          }}
        ></div>
      )}

      <div className="flex flex-col items-center relative z-10">
        <div className={circleStyle}>
          {isCompleted ? "✓" : isSkipped ? "..." : index + 1}
        </div>
        <div className={labelStyle}>
          {label}
          {isOptional && <p className="text-xs text-gray-500">(Optional)</p>}
          {isSkipped && <p className="text-xs text-orange-500">Skipped</p>}
        </div>
      </div>
    </div>
  );
};

// Custom Stepper Container
const CustomStepper: React.FC<{ activeStep: number; skipped: Set<number> }> = ({
  activeStep,
  skipped,
}) => {
  const isStepOptional = (step: number) => step === 1;

  return (
    <div className="flex justify-between w-full px-4 sm:px-8">
      {steps.map((label, index) => (
        <CustomStep
          key={label}
          label={label}
          index={index}
          activeStep={activeStep}
          isSkipped={skipped.has(index)}
          isCompleted={index < activeStep && !skipped.has(index)}
          isOptional={isStepOptional(index)}
        />
      ))}
    </div>
  );
};

function NewProfile() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  // This state is managed by the child components (AddPersonalInfo, etc.)
  // to ensure validation passes before moving to the next step.
  const [canMove, setCanMove] = useState(false);

  const isStepOptional = (step: number) => {
    return step === 1; // Founded Initiative is optional
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    setCanMove(false); // Reset canMove for the new step
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCanMove(true); // Allow moving back immediately
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // This should ideally never happen if the UI is correct
      console.error("Attempted to skip a non-optional step.");
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
    setCanMove(false); // Reset canMove for the new step
  };

  const handleReset = () => {
    setActiveStep(0);
    setSkipped(new Set<number>());
    setCanMove(false);
  };

  // Helper function to render the current step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <AddPersonalInfo canMove={setCanMove} />;
      case 1:
        return <AddFoundedInfo canMove={setCanMove} />;
      case 2:
        return <AddEmployedInfo canMove={setCanMove} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <TopTitle title="Add New Member" />

      {/* Stepper Display */}
      <div className="w-full bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <CustomStepper activeStep={activeStep} skipped={skipped} />
      </div>

      {activeStep === steps.length ? (
        /* Final Step Completed View */
        <div className="mt-8 p-6 bg-green-50 rounded-lg shadow-inner">
          <p className="text-lg font-semibold text-green-700 mb-4">
            All steps completed - a new member has been added.
          </p>
          <p className="text-gray-700 mb-6">
            Please ask them to check their email to reset their password and
            complete their setup.
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2 text-white font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150"
            >
              Add Another Member
            </button>
            <button
              onClick={() => {
                /* Logic to view added member (e.g., redirect to their profile ID) */
                handleReset(); // Optionally reset before navigating, or replace with actual navigation logic
              }}
              className="px-6 py-2 text-indigo-700 font-medium bg-indigo-100 rounded-lg hover:bg-indigo-200 transition duration-150"
            >
              View Added Member
            </button>
          </div>
        </div>
      ) : (
        /* Current Step Content and Controls */
        <div className="mt-4">
          {/* Step Content Area */}
          <div className="py-5">{getStepContent(activeStep)}</div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className={`px-4 py-2 font-medium rounded-lg transition duration-150 ${
                activeStep === 0
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Back
            </button>

            <div className="flex gap-3">
              {isStepOptional(activeStep) && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 font-medium text-orange-600 border border-orange-400 rounded-lg hover:bg-orange-50 transition duration-150"
                >
                  Skip
                </button>
              )}
              <button
                disabled={!canMove}
                onClick={handleNext}
                className={`px-6 py-2 font-medium text-white rounded-lg transition duration-150 ${
                  !canMove
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewProfile;
