import React, { useState } from 'react';
import { TextField, Grid, Typography, Box } from '@mui/material';

function ToolingCost({ onCostChange }) {
  const [toolingInvestment, setToolingInvestment] = useState("");
  const [toolingLifeCycle, setToolingLifeCycle] = useState("");

  const calculateToolingCost = () => {
    const toolingCost = toolingInvestment / toolingLifeCycle;
    onCostChange(toolingCost); 
    return toolingCost.toFixed(2);
  };

  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Tooling Cost
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Tooling Investment"
            fullWidth
            type="number"
            value={toolingInvestment}
            onChange={e => setToolingInvestment(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Tooling Life Cycle"
            fullWidth
            type="number"
            value={toolingLifeCycle}
            onChange={e => setToolingLifeCycle(e.target.value)}
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
