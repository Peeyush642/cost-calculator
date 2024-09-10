import React, { useState } from 'react';
import { TextField, Grid, Typography, Box } from '@mui/material';

function EquipmentCost({ onCostChange , rejectRate, partsPerRun }) {
  const [equipInvest, setEquipInvest] = useState("");
  const [equipLife, setEquipLife] = useState("");
  const [equipAnnuAvilTime, setEquipAnnuAvilTime] = useState("");
  const [equipTime, setEquipTime] = useState("");

  const calculateEquipmentCost = () => {
    const equipmentCostRate = equipInvest / (equipLife * equipAnnuAvilTime)
    const equipmentCost = equipmentCostRate * equipTime / ((1-(rejectRate/100)) * partsPerRun);
    onCostChange(equipmentCost); 
    return equipmentCost.toFixed(2);
  };

  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Equipment Cost
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Equipment Investment"
            fullWidth
            type="number"
            value={equipInvest}
            onChange={e => setEquipInvest(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Equipment Life"
            fullWidth
            type="number"
            value={equipLife}
            onChange={e => setEquipLife(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Annual Available Time"
            fullWidth
            type="number"
            value={equipAnnuAvilTime}
            onChange={e => setEquipAnnuAvilTime(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Process Time"
            fullWidth
            type="number"
            value={equipTime}
            onChange={e => setEquipTime(e.target.value)}
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
