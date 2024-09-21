import React from "react";
import { TextField, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCost } from "../../../../context/costContext";

function EnergyCost({ onCostChange, materialScrapRate, rejectRate, materialWeights }) {
  const { energyCostData, setEnergyCostData } = useCost(); // Get energy data from context
  console.log("scrapRate", materialScrapRate);
  const calculateEnergyCost = () => {
    const reject = parseFloat(rejectRate[0]) / 100;
    const scrapRate = parseFloat(materialScrapRate[0]) / 100;
    const weight = parseFloat(materialWeights[0]);
    const energyCost =
      (energyCostData.consumptionRate * energyCostData.energyPrice * weight) /
      ((1 - scrapRate) * (1 - reject));
    const roundedEnergyCost = energyCost.toFixed(2);
    onCostChange(roundedEnergyCost);
    return roundedEnergyCost;
  };

  const handleChange = (field, value) => {
    setEnergyCostData((prevData) => ({
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
        Energy Cost
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Consumption Rate (KW/kg)"
            fullWidth
            type="number"
            value={energyCostData.consumptionRate}
            onChange={(e) => handleChange("consumptionRate", e.target.value)}
          />
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <TextField
            label="Energy Price (GBP/KW)"
            fullWidth
            type="number"
            value={energyCostData.energyPrice}
            onChange={(e) => handleChange("energyPrice", e.target.value)}
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
