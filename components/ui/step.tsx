import { steps } from "../Dashboard/AddNewUserPage";

// Custom Step Component (Tailwind version of Step + StepLabel)
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
  let labelStyle = "text-sm mt-1 transition duration-300";
  if (isActive) {
    labelStyle += " text-indigo-700 font-semibold";
  } else if (isCompleted || isAfter) {
    labelStyle += " text-gray-700";
  } else {
    labelStyle += " text-gray-500";
  }

  const lineStyle =
    "absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-1 bg-gray-300 transition-colors duration-300 z-0";
  const completedLineStyle = "bg-green-500";
  const activeLineStyle = "bg-indigo-300";

  return (
    <div className="flex-1 relative">
      {index < steps.length - 1 && (
        <div
          className={`${lineStyle} ${isAfter ? completedLineStyle : ""} ${isActive ? activeLineStyle : ""}`}
        ></div>
      )}

      <div className="flex flex-col items-center relative z-10">
        <div className={circleStyle}>{isCompleted ? "✓" : index + 1}</div>
        <div className={labelStyle}>
          {label}
          {isOptional && <p className="text-xs text-gray-500">Optional</p>}
          {isSkipped && <p className="text-xs text-orange-500">Skipped</p>}
        </div>
      </div>
    </div>
  );
};

export const CustomStepper: React.FC<{ activeStep: number; skipped: Set<number> }> = ({
  activeStep,
  skipped,
}) => {
  const isStepOptional = (step: number) => step === 1;

  return (
    <div className="flex justify-between w-full">
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
