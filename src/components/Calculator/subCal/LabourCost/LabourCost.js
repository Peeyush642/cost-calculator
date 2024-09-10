import React, { useState } from 'react';
import { TextField, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

function LabourCost({ onCostChange, rejectRate, labourPartsPerRun }) {
  const [labourTime, setLabourTime] = useState("");
  const [labourRate, setLabourRate] = useState("");
  const [partsPerRun, setPartsPerRun] = useState("");

  const calculateLabourCost = () => {
    const time = parseFloat(labourTime);
    const rate = parseFloat(labourRate);
    const reject = parseFloat(rejectRate) / 100;
    const parts = parseFloat(partsPerRun);

    if (!isNaN(time) && !isNaN(rate) && !isNaN(reject) && !isNaN(parts)) {
      const totalLabourCost = (time * rate) / ((1 - reject) * parts);
      onCostChange(totalLabourCost);
      labourPartsPerRun(parts);
      return totalLabourCost.toFixed(2);
    }
    return "0.00";
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
            value={labourTime}
            onChange={e => setLabourTime(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Labour Rate"
            fullWidth
            placeholder="Enter rate"
            type="number"
            value={labourRate}
            onChange={e => setLabourRate(e.target.value)}
          />
        </Grid>
       
        <Grid size={{ xs: 6 }}>
          <TextField
            label="No. of Parts Per Run"
            fullWidth
            placeholder="Enter parts per run"
            type="number"
            value={partsPerRun}
            onChange={e => setPartsPerRun(e.target.value)}
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
