import React, { useState } from 'react';
import { TextField, Typography, Box } from '@mui/material';
import Grid from "@mui/material/Grid2";

function EnergyCost({ onCostChange, materialScrapRate, rejectRate }) {
  const [consumptionRate, setConsumptionRate] = useState("");
  const [energyPrice, setEnergyPrice] = useState("");

  const calculateEnergyCost = () => {
    const energyCost = (consumptionRate * energyPrice)/((1 - materialScrapRate/100) * (1 - rejectRate/100));
    onCostChange(energyCost); 
    return energyCost.toFixed(2);
  };

  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Energy Cost
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{xs:6}}>
          <TextField
            label="Consumption Rate"
            fullWidth
            type="number"
            value={consumptionRate}
            onChange={e => setConsumptionRate(e.target.value)}
          />
        </Grid>
        <Grid item size={{xs:6}}>
          <TextField
            label="Energy Price"
            fullWidth
            type="number"
            value={energyPrice}
            onChange={e => setEnergyPrice(e.target.value)}
          />
        </Grid>
      </Grid>
      <Typography variant="body1" mt={2}>
        Energy Cost: <strong>{calculateEnergyCost()}</strong>
      </Typography>
    </Box>
  );
}

export default EnergyCost;
