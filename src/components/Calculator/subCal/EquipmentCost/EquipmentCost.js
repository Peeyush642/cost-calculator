import React from 'react';
import { TextField, Typography, Box } from '@mui/material';
import Grid from "@mui/material/Grid2";
import { useCost } from "../../../../context/costContext";  

function EquipmentCost({ onCostChange, rejectRate, partsPerRun }) {
  const { equipmentCostData, setEquipmentCostData } = useCost(); // Get equipment data from context

  const calculateEquipmentCost = () => {
    const equipmentCostRate = equipmentCostData.equipInvest / (equipmentCostData.equipLife * equipmentCostData.equipAnnuAvilTime);
    const equipmentCost = equipmentCostRate * equipmentCostData.equipTime / ((1 - (rejectRate / 100)) * partsPerRun);
    onCostChange(equipmentCost);
    return equipmentCost.toFixed(2);
  };

  const handleChange = (field, value) => {
    setEquipmentCostData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Equipment Cost
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Equipment Investment"
            fullWidth
            type="number"
            value={equipmentCostData.equipInvest}
            onChange={e => handleChange('equipInvest', e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Equipment Life"
            fullWidth
            type="number"
            value={equipmentCostData.equipLife}
            onChange={e => handleChange('equipLife', e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Annual Available Time"
            fullWidth
            type="number"
            value={equipmentCostData.equipAnnuAvilTime}
            onChange={e => handleChange('equipAnnuAvilTime', e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Process Time"
            fullWidth
            type="number"
            value={equipmentCostData.equipTime}
            onChange={e => handleChange('equipTime', e.target.value)}
          />
        </Grid>
      </Grid>
      <Typography variant="body1" mt={2}>
        Equipment Cost: <strong>{calculateEquipmentCost()}</strong>
      </Typography>
    </Box>
  );
}

export default EquipmentCost;
