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
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components for Chart.js
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function CostCalculator() {
  const { resetAllCosts } = useCost(); // Get reset function from context
  const [currentStep, setCurrentStep] = useState(0);
  const [process, setProcess] = useState(null); // Keep track of which process the user is going through
  const [processCompleted, setProcessCompleted] = useState({
    HANDLAYUP: false,
    VARTM: false,
  });
  const [results, setResults] = useState({
    HANDLAYUP: {},
    VARTM: {},
  });

  const [materialCost, setMaterialCost] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [energyCost, setEnergyCost] = useState(0);
  const [equipmentCost, setEquipmentCost] = useState(0);
  const [toolingCost, setToolingCost] = useState(0);
  const [facilityCost, setFacilityCost] = useState(0);

  const [rejectRate, setRejectRate] = useState(0);
  const [materialScrapRate, setMaterialScrapRate] = useState(0);
  const [labourPartsPerRun, setLabourPartsPerRun] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
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

  const handleReload = () => {
    window.location.reload();
  };

  const handleNewCalculation = () => {
    const currentResults = {
      materialCost,
      labourCost,
      energyCost,
      equipmentCost,
      toolingCost,
      facilityCost,
      totalCost: calculateTotalCost(),
    };
    // Save results based on the process
    setResults((prevResults) => ({
      ...prevResults,
      [process]: currentResults,
    }));

    setProcessCompleted((prevState) => ({
      ...prevState,
      [process]: true,
    }));

    resetAllCosts();
    setCurrentStep(0);
  };

  const handleProcessSelection = (selectedProcess) => {
    setShowComparison(false);
    setProcess(selectedProcess);
    resetAllCosts();
    setCurrentStep(0);
  };

  const handleCompareResults = () => {
    setShowComparison(true); // Show the bar chart when the button is clicked
  };

  const renderComparisonChart = () => {
    const handLayupResult = results.HANDLAYUP;
    const vartmResult = results.VARTM;

    if (handLayupResult && vartmResult) {
      const data = {
        labels: [
          "Material Cost",
          "Labour Cost",
          "Energy Cost",
          "Equipment Cost",
          "Tooling Cost",
          "Facility Cost",
          "Total Cost",
        ],
        datasets: [
          {
            label: "HAND-LAYUP",
            data: [
              handLayupResult.materialCost,
              handLayupResult.labourCost,
              handLayupResult.energyCost,
              handLayupResult.equipmentCost,
              handLayupResult.toolingCost,
              handLayupResult.facilityCost,
              handLayupResult.totalCost,
            ],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
          {
            label: "VARTM",
            data: [
              vartmResult.materialCost,
              vartmResult.labourCost,
              vartmResult.energyCost,
              vartmResult.equipmentCost,
              vartmResult.toolingCost,
              vartmResult.facilityCost,
              vartmResult.totalCost,
            ],
            backgroundColor: "rgba(153, 102, 255, 0.6)",
          },
        ],
      };

      const options = {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Comparison Between HAND-LAYUP and VARTM",
          },
        },
      };

      return <Bar data={data} options={options} />;
    }
    return null;
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

      {/* Process Selection */}
      {process === null && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">Select a Process to Start</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleProcessSelection("HANDLAYUP")}
          >
            HAND-LAYUP
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleProcessSelection("VARTM")}
            sx={{ marginLeft: "10px" }}
          >
            VARTM
          </Button>
        </Box>
      )}

      {/* Main Calculation Steps */}
      {process !== null && !processCompleted[process] && (
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
      )}

      <Box mt={4} textAlign="center">
        {process !== null && !processCompleted[process] && (
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
                Finish {process} Process
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
        )}

        {/* After one process completed, prompt the user to start the next process */}
        {process !== null && processCompleted[process] && (
          <Box>
            {/* Only show if both processes are NOT completed */}
            {(!processCompleted.HANDLAYUP || !processCompleted.VARTM) && (
              <Typography variant="h5">
                {process} Process Completed! Choose the next process.
              </Typography>
            )}

            {/* Start other process buttons */}
            {!processCompleted.HANDLAYUP && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleProcessSelection("HANDLAYUP")}
              >
                Start HAND-LAYUP
              </Button>
            )}
            {!processCompleted.VARTM && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleProcessSelection("VARTM")}
                sx={{ marginLeft: "10px" }}
              >
                Start VARTM
              </Button>
            )}

            {/* Show compare results button when both processes are completed */}
            {processCompleted.HANDLAYUP && processCompleted.VARTM && (
              <Button
                variant="contained"
                color="success"
                onClick={handleCompareResults}
                sx={{ marginLeft: "10px" }}
              >
                Compare Results
              </Button>
            )}
          </Box>
        )}

        {/* Show the comparison bar chart when 'Compare Results' is clicked */}
        {showComparison && (
          <Box mt={4}>
            {renderComparisonChart()}
            <Button
              variant="contained"
              color="error"
              onClick={handleReload}
              sx={{ marginTop: "20px" }}
            >
              Start New Calculation
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default CostCalculator;
