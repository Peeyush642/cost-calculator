import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoneIcon from "@mui/icons-material/Done";
import { Box, Typography } from "@mui/material";

const ProgressBar = ({ currentStep, setCurrentStep }) => {
  const steps = [
    "Material Cost",
    "Labour Cost",
    "Energy Cost",
    "Equipment Cost",
    "Tooling Cost",
    "Facility Cost",
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {steps.map((step, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: currentStep >= index ? "pointer" : "not-allowed",
            padding: "8px",
            backgroundColor: currentStep === index ? "#f0f0f0" : "transparent",
            borderRadius: "5px",
            pointerEvents: currentStep >= index ? "auto" : "none", // Disable future steps
          }}
          onClick={() => {
            if (index <= currentStep) {
              setCurrentStep(index);
            }
          }}
        >
          <Typography sx={{ flexGrow: 1 }}>{`${
            index + 1
          }. ${step}`}</Typography>
          {currentStep === index ? (
            <ArrowForwardIcon sx={{ color: `var(--indigo-800)` }} />
          ) : currentStep > index ? (
            <DoneIcon sx={{ color: `var(--green-700)` }} />
          ) : null}
        </Box>
      ))}
    </Box>
  );
};

export default ProgressBar;
