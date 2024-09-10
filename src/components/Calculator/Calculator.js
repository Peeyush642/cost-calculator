import React, { useState } from "react";
import { useCost } from "../../context/costContext"; // Adjust the import path for your project
import MaterialCost from "./subCal/MaterialCost/MaterialCost";
import LabourCost from "./subCal/LabourCost/LabourCost";
import EnergyCost from "./subCal/EnergyCost/EnergyCost";
import EquipmentCost from "./subCal/EquipmentCost/EquipmentCost";
import ToolingCost from "./subCal/ToolingCost/ToolingCost";
import FacilityCost from "./subCal/FacilityCost/FacilityCost";
import ProgressBar from "./ProgressBar/ProgressBar";
import { Container, Typography, Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { motion } from "framer-motion";

function CostCalculator() {
  const { resetAllCosts } = useCost(); // Get reset function from context
  const [currentStep, setCurrentStep] = useState(0);

  const [materialCost, setMaterialCost] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [energyCost, setEnergyCost] = useState(0);
  const [equipmentCost, setEquipmentCost] = useState(0);
  const [toolingCost, setToolingCost] = useState(0);
  const [facilityCost, setFacilityCost] = useState(0);

  const [rejectRate, setRejectRate] = useState(0);
  const [materialScrapRate, setMaterialScrapRate] = useState(0);
  const [labourPartsPerRun, setLabourPartsPerRun] = useState(0);

  const calculateTotalCost = () => {
    return (
      materialCost +
      labourCost +
      energyCost +
      equipmentCost +
      toolingCost +
      facilityCost
    ).toFixed(2);
  };

  const handleNextClick = () => {
    if (currentStep < 5) setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBackClick = () => {
    if (currentStep > 0) setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleNewCalculation = () => {
    resetAllCosts(); // Reset context values
    setCurrentStep(0); // Reset to the first step
    setMaterialCost(0);
    setLabourCost(0);
    setEnergyCost(0);
    setEquipmentCost(0);
    setToolingCost(0);
    setFacilityCost(0);
    setRejectRate(0);
    setMaterialScrapRate(0);
    setLabourPartsPerRun(0);
  };

  // Motion variants for animation
  const stepVariants = {
    initial: { opacity: 0, x: 100 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center">
        Cost Calculator
      </Typography>

      <Grid container spacing={2} flexDirection={"row"}>
        <Grid item xs={3} minWidth="200px">
          <ProgressBar
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </Grid>

        <Grid item xs={9} p={2} sx={{ width: "800px" }}>
          <motion.div
            key={currentStep}
            initial="initial"
            animate="enter"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.5 }}
          >
            {currentStep === 0 && (
              <MaterialCost
                onCostChange={setMaterialCost}
                rejectRate={setRejectRate}
                materialScrapRate={setMaterialScrapRate}
              />
            )}
            {currentStep === 1 && (
              <LabourCost
                onCostChange={setLabourCost}
                rejectRate={rejectRate}
                labourPartsPerRun={setLabourPartsPerRun}
              />
            )}
            {currentStep === 2 && (
              <EnergyCost
                onCostChange={setEnergyCost}
                rejectRate={rejectRate}
                materialScrapRate={materialScrapRate}
              />
            )}
            {currentStep === 3 && (
              <EquipmentCost
                onCostChange={setEquipmentCost}
                rejectRate={rejectRate}
                partsPerRun={labourPartsPerRun}
              />
            )}
            {currentStep === 4 && (
              <ToolingCost
                onCostChange={setToolingCost}
                partsPerRun={labourPartsPerRun}
              />
            )}
            {currentStep === 5 && (
              <FacilityCost
                onCostChange={setFacilityCost}
                rejectRate={rejectRate}
                partsPerRun={labourPartsPerRun}
              />
            )}
          </motion.div>
        </Grid>
      </Grid>

      <Box mt={4} textAlign="center">
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBackClick}
            disabled={currentStep === 0}
            sx={{ marginRight: "10px" }}
          >
            Back
          </Button>
          {currentStep === 5 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNewCalculation}
          >
            New Calculation
          </Button>
        )}
          {currentStep < 5 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextClick}
            >
              Next
            </Button>
          )}
        </Box>
        {currentStep === 5 && (
          <Box mt={2}>
            <Typography variant="h5">
              Total Cost per Part: <strong>{calculateTotalCost()}</strong>
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default CostCalculator;
