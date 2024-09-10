import React from 'react';
import { TextField, Typography, Box } from '@mui/material';
import Grid from "@mui/material/Grid2";
import { useCost } from "../../../../context/costContext";  

function EnergyCost({ onCostChange, materialScrapRate, rejectRate }) {
  const { energyCostData, setEnergyCostData } = useCost(); // Get energy data from context

  const calculateEnergyCost = () => {
    const energyCost = (energyCostData.consumptionRate * energyCostData.energyPrice) / ((1 - materialScrapRate / 100) * (1 - rejectRate / 100));
    onCostChange(energyCost);
    return energyCost.toFixed(2);
  };

  const handleChange = (field, value) => {
    setEnergyCostData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Energy Cost
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Consumption Rate"
            fullWidth
            type="number"
            value={energyCostData.consumptionRate}
            onChange={e => handleChange('consumptionRate', e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Energy Price"
            fullWidth
            type="number"
            value={energyCostData.energyPrice}
            onChange={e => handleChange('energyPrice', e.target.value)}
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
