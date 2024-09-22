import React from "react";
import { TextField, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCost } from "../../../../context/costContext";

function FacilityCost({ onCostChange, rejectRate, partsPerRun, processTime }) {
  const { facilityCostData, setFacilityCostData } = useCost();

  const calculateFacilityCost = () => {
    const facilityCostRate =
      facilityCostData.facilityInvestment /
      (facilityCostData.facilityLife * facilityCostData.anualAvailableTimeDays * facilityCostData.anualAvailableTimeHours);
    const facilityCost =
      (facilityCostRate * processTime[0]) /
      ((1 - rejectRate[0] / 100) * partsPerRun[0]);
    const roundedFacilityCost = facilityCost.toFixed(2);
    onCostChange(roundedFacilityCost);
    return roundedFacilityCost;
  };

  const handleChange = (field, value) => {
    setFacilityCostData((prevData) => ({
      ...prevData,
      [field]: value,
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
            label="Annual Available Time in Days per year (hrs)"
            fullWidth
            type="number"
            value={facilityCostData.anualAvailableTimeDays}
            onChange={(e) => handleChange("anualAvailableTimeDays", e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
        <TextField
            label="Annual Available Time in Hours per day (hrs)"
            fullWidth
            type="number"
            value={facilityCostData.anualAvailableTimeHours}
            onChange={(e) => handleChange("anualAvailableTimeHours", e.target.value)}
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
