import React, { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

function FacilityCost({ onCostChange, rejectRate, partsPerRun }) {
  const [facilityInvestment, setFacilityInvestment] = useState("");
  const [facilityLife, setFacilityLife] = useState("");
  const [annualAvailableTime, setAnnualAvailableTime] = useState("");
  const [processTime, setProcessTime] = useState("");

  const calculateFacilityCost = () => {
    const facilityCostRate =
      facilityInvestment / (facilityLife * annualAvailableTime);
    const facilityCost =
      (facilityCostRate * processTime) / ((1 - rejectRate / 100) * partsPerRun);
    onCostChange(facilityCost); 
    return facilityCost.toFixed(2);
  };

  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Facility Cost
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Facility Investment"
            fullWidth
            type="number"
            value={facilityInvestment}
            onChange={(e) => setFacilityInvestment(e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Facility Life"
            fullWidth
            type="number"
            value={facilityLife}
            onChange={(e) => setFacilityLife(e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Annual Available Time"
            fullWidth
            type="number"
            value={annualAvailableTime}
            onChange={(e) => setAnnualAvailableTime(e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Process Time"
            fullWidth
            type="number"
            value={processTime}
            onChange={(e) => setProcessTime(e.target.value)}
          />
        </Grid>
      </Grid>
      <Typography variant="body1" mt={2}>
        Facility Cost: <strong>{calculateFacilityCost()}</strong>
      </Typography>
    </Box>
  );
}

export default FacilityCost;
