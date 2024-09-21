import React, { useState } from "react";
import { useCost } from "../../context/costContext"; // Adjust the import path for your project
import MaterialCost from "./subCal/MaterialCost/MaterialCost";
import LabourCost from "./subCal/LabourCost/LabourCost";
import EnergyCost from "./subCal/EnergyCost/EnergyCost";
import EquipmentCost from "./subCal/EquipmentCost/EquipmentCost";
import ToolingCost from "./subCal/ToolingCost/ToolingCost";
import FacilityCost from "./subCal/FacilityCost/FacilityCost";
import ProgressBar from "./ProgressBar/ProgressBar";
import { useMediaQuery } from "@mui/material";
import styles from "./Calculator.module.css";
import {
  Container,
  Typography,
  Box,
  Button,
  Modal,
  Tabs,
  Tab,
} from "@mui/material";
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
  const [results, setResults] = useState({
    HANDLAYUP: [],
    VARTM: [],
  });

  const [materialCost, setMaterialCost] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [energyCost, setEnergyCost] = useState(0);
  const [equipmentCost, setEquipmentCost] = useState(0);
  const [toolingCost, setToolingCost] = useState(0);
  const [facilityCost, setFacilityCost] = useState(0);

  const [rejectRate, setRejectRate] = useState(0);
  const [materialScrapRate, setMaterialScrapRate] = useState(0);
  const [labourPartsPerRun, setLabourPartsPerRun] = useState(1);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // // Open the modal when comparison is clicked
  // const handleCompareResults = () => {
  //   setShowComparisonModal(true); // Show the modal instead of displaying the chart directly
  // };

  const handleCloseModal = () => {
    setShowComparisonModal(false);
  };

  const calculateTotalCost = () => {
    return (
      parseFloat(materialCost) +
      parseFloat(labourCost) +
      parseFloat(energyCost) +
      parseFloat(equipmentCost) +
      parseFloat(toolingCost) +
      parseFloat(facilityCost)
    ).toFixed(2);
  };

  const handleNextClick = () => {
    if (currentStep < 5) setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBackClick = () => {
    if (currentStep > 0) setCurrentStep((prevStep) => prevStep - 1);
  };

  const isHidden = useMediaQuery("(max-width:880px)");

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

    // Store results for the selected process
    setResults((prevResults) => ({
      ...prevResults,
      [process]: [...prevResults[process], currentResults],
    }));

    resetAllCosts();
    setProcess(null); // Set process back to null to show process selection after each run
    setCurrentStep(0);
  };

  const handleProcessSelection = (selectedProcess) => {
    // setShowComparison(false);
    setProcess(selectedProcess); // Set the selected process (HANDLAYUP or VARTM)
    resetAllCosts();
    setCurrentStep(0);
  };

  const handleCompareResults = () => {
    setShowComparisonModal(true); // Show the bar chart when the button is clicked
  };

  const renderComparisonChart = () => {
    const handLayupResults = results.HANDLAYUP;
    const vartmResults = results.VARTM;

    if (handLayupResults.length > 0 || vartmResults.length > 0) {
      const labels = [
        "Material Cost",
        "Labour Cost",
        "Energy Cost",
        "Equipment Cost",
        "Tooling Cost",
        "Facility Cost",
        "Total Cost",
      ];

      const handLayupData = handLayupResults.map((result, index) => ({
        label: `HAND-LAYUP Run ${index + 1}`,
        data: [
          result.materialCost,
          result.labourCost,
          result.energyCost,
          result.equipmentCost,
          result.toolingCost,
          result.facilityCost,
          result.totalCost,
        ],
        backgroundColor: `rgba(75, 192, 192, ${0.6 - index * 0.1})`,
      }));

      const vartmData = vartmResults.map((result, index) => ({
        label: `VARTM Run ${index + 1}`,
        data: [
          result.materialCost,
          result.labourCost,
          result.energyCost,
          result.equipmentCost,
          result.toolingCost,
          result.facilityCost,
          result.totalCost,
        ],
        backgroundColor: `rgba(153, 102, 255, ${0.6 - index * 0.1})`,
      }));

      const data = {
        labels,
        datasets: [...handLayupData, ...vartmData], // Compare between multiple runs of the same or different processes
      };

      const options = {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Comparison Between HAND-LAYUP and VARTM (Multiple Runs)",
          },
        },
      };

      return <Bar data={data} options={options} />;
    }
    return null;
  };

  const stepVariants = {
    initial: { opacity: 0, x: 100 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center">
        Composite Cost Calculator
      </Typography>

      {/* Process Selection */}
      {process === null && (
        <Box textAlign="center">
          {results.HANDLAYUP.length + results.VARTM.length < 1 && (
            <Typography variant="h6" gutterBottom>
              Select the process to start the calculation
            </Typography>
          )}
          <Typography variant="h6" gutterBottom>
            {results.HANDLAYUP.length + results.VARTM.length >= 1
              ? "Select a new process to start another calculation"
              : null}
          </Typography>

          <div className={styles.processSelectionContainer}>
            <div
              className={styles.processSelection}
              onClick={() => handleProcessSelection("HANDLAYUP")}
            >
              <span>HAND-LAYUP</span>
            </div>
            <div
              className={styles.processSelection}
              onClick={() => handleProcessSelection("VARTM")}
            >
              <span>VARTM</span>
            </div>
          </div>
        </Box>
      )}

      {/* Main Calculation Steps */}
      {process !== null && (
        <Grid
          container
          spacing={2}
          flexDirection={"row"}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
          sx={{
            "&.MuiGrid2-root": {
              flexWrap: "nowrap",
            },
          }}
        >
          {!isHidden && (
            <Grid
              item
              xs={3}
              maxWidth="18rem"
              width={"30%"}
              backgroundColor="#fff"
              p={2}
              borderRadius={"0.5rem"}
              sx={{
                display: {
                  xs: "block",
                  "@media (max-width:880px)": "none", // hidden at 880px or below
                },
              }}
            >
              <ProgressBar
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            </Grid>
          )}

          <Grid
            item
            xs={9}
            p={2}
            sx={{ width: "800px" }}
            backgroundColor="#fff"
            borderRadius={"0.5rem"}
          >
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
                  selectedProcess={process}
                />
              )}
              {currentStep === 1 && (
                <LabourCost
                  onCostChange={setLabourCost}
                  rejectRate={rejectRate}
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
        {process !== null && (
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
            {currentStep < 5 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextClick}
              >
                Next
              </Button>
            )}
            {currentStep === 5 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNewCalculation}
              >
                Calculate Total Cost
              </Button>
            )}
          </Box>
        )}
      </Box>
      {process == null && (
        <Box mt={4} textAlign="center">
          {results.HANDLAYUP.length + results.VARTM.length >= 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCompareResults}
            >
              Results
            </Button>
          )}

          {results.HANDLAYUP.length + results.VARTM.length >= 1 && (
            <Box
              mt={4}
              textAlign="center"
              style={{ position: "absolute", left: "1rem", top: "0rem" }}
            >
              <Button variant="contained" color="error" onClick={handleReload}>
                Clear All Results
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Modal open={showComparisonModal} onClose={handleCloseModal}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: "8px",
            width: "80%",
            margin: "auto",
            mt: 8,
          }}
        >
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Data" />
            <Tab label="Bar Chart" />
          </Tabs>

          {selectedTab === 0 && (
            <Box p={2}>
              {/* Render the raw data comparison */}
              <Typography variant="h6">Data Comparison</Typography>
              {results.HANDLAYUP.length > 0 && (
                <Box>
                  <Typography variant="subtitle1">HAND-LAYUP</Typography>
                  {results.HANDLAYUP.map((run, index) => (
                    <Box key={index}>
                      <Typography variant="subtitle2">
                        Run {index + 1}
                      </Typography>
                      <Typography variant="body2">
                        Material Cost: {run.materialCost}
                      </Typography>
                      <Typography variant="body2">
                        Labour Cost: {run.labourCost}
                      </Typography>
                      <Typography variant="body2">
                        Energy Cost: {run.energyCost}
                      </Typography>
                      <Typography variant="body2">
                        Equipment Cost: {run.equipmentCost}
                      </Typography>
                      <Typography variant="body2">
                        Tooling Cost: {run.toolingCost}
                      </Typography>
                      <Typography variant="body2">
                        Facility Cost: {run.facilityCost}
                      </Typography>
                      <Typography variant="body2">
                        Total Cost: {run.totalCost}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {results.VARTM.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1">VARTM</Typography>
                  {results.VARTM.map((run, index) => (
                    <Box key={index}>
                      <Typography variant="subtitle2">
                        Run {index + 1}
                      </Typography>
                      <Typography variant="body2">
                        Material Cost: {run.materialCost}
                      </Typography>
                      <Typography variant="body2">
                        Labour Cost: {run.labourCost}
                      </Typography>
                      <Typography variant="body2">
                        Energy Cost: {run.energyCost}
                      </Typography>
                      <Typography variant="body2">
                        Equipment Cost: {run.equipmentCost}
                      </Typography>
                      <Typography variant="body2">
                        Tooling Cost: {run.toolingCost}
                      </Typography>
                      <Typography variant="body2">
                        Facility Cost: {run.facilityCost}
                      </Typography>
                      <Typography variant="body2">
                        Total Cost: {run.totalCost}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {selectedTab === 1 && (
            <Box p={2}>
              {/* Render the comparison chart */}
              {renderComparisonChart()}
            </Box>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default CostCalculator;
