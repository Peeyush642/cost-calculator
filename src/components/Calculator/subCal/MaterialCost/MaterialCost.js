import React, { useEffect } from "react";
import { TextField, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCost } from "../../../../context/costContext";

function MaterialCost({ onCostChange, rejectRate, materialScrapRate }) {
  const { materialCostData, setMaterialCostData } = useCost();

  useEffect(() => {
    rejectRate(materialCostData.rejectedRate);
    materialScrapRate(materialCostData.scrapRate);
  }, [materialCostData.rejectedRate, materialCostData.scrapRate, rejectRate, materialScrapRate]);

  const calculateMaterialCost = () => {
    const weight = parseFloat(materialCostData.materialWeight);
    const price = parseFloat(materialCostData.unitPrice);
    const scrap = parseFloat(materialCostData.scrapRate) / 100;
    const reject = parseFloat(materialCostData.rejectedRate) / 100;

    if (!isNaN(weight) && !isNaN(price) && !isNaN(scrap) && !isNaN(reject)) {
      const totalRawMaterial = (weight * price) / ((1 - scrap) * (1 - reject));
      onCostChange(totalRawMaterial); 
      return totalRawMaterial.toFixed(2);
    }
    return "0.00";
  };

  const handleChange = (field, value) => {
    setMaterialCostData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant="h6" gutterBottom>
        Material Cost
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Material Weight"
            fullWidth
            placeholder="Enter weight"
            type="number"
            value={materialCostData.materialWeight}
            onChange={(e) => handleChange("materialWeight", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Unit Price"
            fullWidth
            placeholder="Enter price"
            type="number"
            value={materialCostData.unitPrice}
            onChange={(e) => handleChange("unitPrice", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Scrap Rate (%)"
            fullWidth
            placeholder="Enter scrap rate"
            type="number"
            value={materialCostData.scrapRate}
            onChange={(e) => handleChange("scrapRate", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Rejected Rate (%)"
            fullWidth
            placeholder="Enter rejected rate"
            type="number"
            value={materialCostData.rejectedRate}
            onChange={(e) => handleChange("rejectedRate", e.target.value)}
          />
        </Grid>
      </Grid>
      <Typography variant="body1" mt={2}>
        Material Cost: <strong>{calculateMaterialCost()}</strong>
      </Typography>
    </Box>
  );
}

export default MaterialCost;
