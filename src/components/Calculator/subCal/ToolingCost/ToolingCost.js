import React from "react";
import { TextField, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCost } from "../../../../context/costContext"; // Import useCost

function ToolingCost({ onCostChange, rejectRate, partsPerRun }) {
  const { toolingCostData, setToolingCostData } = useCost(); // Get tooling data from context

  const calculateToolingCost = () => {
    // Ensure all values are treated as numbers using parseFloat
    const toolingInvestment =
      parseFloat(toolingCostData.toolingInvestment) || 0;
    const toolingLifeCycle = parseFloat(toolingCostData.toolingLifeCycle) || 0;
    const validRejectRate = parseFloat(rejectRate) || 0;
    const validPartsPerRun = parseFloat(partsPerRun) || 0;

    // Perform the calculation with numeric values
    const toolingCost =
      (toolingInvestment / (1 - validRejectRate)) *
      validPartsPerRun *
      toolingLifeCycle;

    onCostChange(toolingCost);
    return toolingCost.toFixed(2);
  };

  const handleChange = (field, value) => {
    setToolingCostData((prevData) => ({
      ...prevData,
      [field]: parseFloat(value) || 0, // Ensure numeric values are stored in state
    }));
  };

  return (
    <Box
      p={2}
      border={1}
      borderColor="grey.300"
      borderRadius={2}
      height={"60vh"}
      overflow={"scroll"}
    >
      <Typography variant="h6" gutterBottom>
        Tooling Cost
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Tooling Investment"
            fullWidth
            type="number"
            value={toolingCostData.toolingInvestment}
            onChange={(e) => handleChange("toolingInvestment", e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Tooling Life Cycle"
            fullWidth
            type="number"
            value={toolingCostData.toolingLifeCycle}
            onChange={(e) => handleChange("toolingLifeCycle", e.target.value)}
          />
        </Grid>
      </Grid>
      <Typography variant="body1" mt={2}>
        Tooling Cost: <strong>{calculateToolingCost()}</strong>
      </Typography>
    </Box>
  );
}

export default ToolingCost;
