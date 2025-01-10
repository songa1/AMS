"use client";

import React, { useState } from "react";
import TopTitle from "../../../Other/TopTitle";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import AddPersonalInfo from "./AddPersonalInfo";
import AddFoundedInfo from "./AddFoundedInfo";
import AddEmployedInfo from "./AddEmployedInfo";

const steps = [
  "Personal Information",
  "Founded Initiative information",
  "Employment information",
];

function NewProfile() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [canMove, setCanMove] = useState(false);

  const isStepOptional = (step: number) => {
    return step === 1;
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
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="">
      <div className="w-full">
        <TopTitle title="Add New Member" />
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - a new member has been added. Please ask
                them to check their email for email to reset their password.
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "row", pt: 2, gap: 2 }}
              >
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset} variant="contained">
                  Add Another Member
                </Button>
                <Button onClick={handleReset} variant="contained" color="info">
                  View Added Member
                </Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 && (
                <div className="py-5">
                  <AddPersonalInfo canMove={setCanMove} />
                </div>
              )}
              {activeStep === 1 && (
                <div className="py-5">
                  <AddFoundedInfo canMove={setCanMove} />
                </div>
              )}
              {activeStep === 2 && (
                <div className="py-5">
                  <AddEmployedInfo canMove={setCanMove} />
                </div>
              )}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}
                <Button
                  disabled={!canMove}
                  onClick={handleNext}
                  variant="contained"
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </div>
    </div>
  );
}

export default NewProfile;
