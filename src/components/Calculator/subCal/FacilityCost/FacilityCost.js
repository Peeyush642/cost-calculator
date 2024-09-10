import React from "react";
import { TextField, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCost } from "../../../../context/costContext";  

function FacilityCost({ onCostChange, rejectRate, partsPerRun }) {
  const { facilityCostData, setFacilityCostData } = useCost(); 

  const calculateFacilityCost = () => {
    const facilityCostRate =
      facilityCostData.facilityInvestment / (facilityCostData.facilityLife * facilityCostData.anualAvailableTime);
    const facilityCost =
      (facilityCostRate * facilityCostData.processTime) / ((1 - rejectRate / 100) * partsPerRun);
    onCostChange(facilityCost); 
    return facilityCost.toFixed(2);
  };

  const handleChange = (field, value) => {
    setFacilityCostData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
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
            value={facilityCostData.facilityInvestment}
            onChange={(e) => handleChange("facilityInvestment", e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Facility Life"
            fullWidth
            type="number"
            value={facilityCostData.facilityLife}
            onChange={(e) => handleChange("facilityLife", e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Annual Available Time"
            fullWidth
            type="number"
            value={facilityCostData.anualAvailableTime}
            onChange={(e) => handleChange("anualAvailableTime", e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Process Time"
            fullWidth
            type="number"
            value={facilityCostData.processTime}
            onChange={(e) => handleChange("processTime", e.target.value)}
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
