import React, { useEffect } from 'react';
import { TextField, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCost } from "../../../../context/costContext"; 

function LabourCost({ onCostChange, rejectRate, labourPartsPerRun }) {
  const { laborCostData, setLaborCostData } = useCost(); // Get labour data from context

  useEffect(() => {
    labourPartsPerRun(laborCostData.partsPerRun);
  }, [laborCostData.partsPerRun, labourPartsPerRun]);

  const calculateLabourCost = () => {
    const time = parseFloat(laborCostData.laborTime);
    const rate = parseFloat(laborCostData.laborRate);
    const reject = parseFloat(rejectRate) / 100;
    const parts = parseFloat(laborCostData.partsPerRun);

    if (!isNaN(time) && !isNaN(rate) && !isNaN(reject) && !isNaN(parts)) {
      const totalLabourCost = (time * rate) / ((1 - reject) * parts);
      onCostChange(totalLabourCost);
      return totalLabourCost.toFixed(2);
    }
    return "0.00";
  };

  const handleChange = (field, value) => {
    setLaborCostData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Labour Cost
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Labour Time"
            fullWidth
            placeholder="Enter time"
            type="number"
            value={laborCostData.laborTime}
            onChange={(e) => handleChange("laborTime", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Labour Rate"
            fullWidth
            placeholder="Enter rate"
            type="number"
            value={laborCostData.laborRate}
            onChange={(e) => handleChange("laborRate", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="No. of Parts Per Run"
            fullWidth
            placeholder="Enter parts per run"
            type="number"
            value={laborCostData.partsPerRun}
            onChange={(e) => handleChange("partsPerRun", e.target.value)}
          />
        </Grid>
      </Grid>
      <Typography variant="body1" mt={2}>
        Labour Cost: <strong>{calculateLabourCost()}</strong>
      </Typography>
    </Box>
  );
}

export default LabourCost;
