import React, { useEffect, useState } from "react";
import { TextField, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2"; // Import Grid2

function MaterialCost({ onCostChange, rejectRate, materialScrapRate }) {
  const [materialWeight, setMaterialWeight] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [scrapRate, setScrapRate] = useState("");
  const [rejectedRate, setRejectedRate] = useState("");

  useEffect(() => {
    setRejectedRate(rejectedRate);
    rejectRate(rejectedRate);
    materialScrapRate(scrapRate);
  }, [rejectedRate, rejectRate, scrapRate, materialScrapRate]);

  const calculateMaterialCost = () => {
    const weight = parseFloat(materialWeight);
    const price = parseFloat(unitPrice);
    const scrap = parseFloat(scrapRate) / 100;
    const reject = parseFloat(rejectedRate) / 100;

    if (!isNaN(weight) && !isNaN(price) && !isNaN(scrap) && !isNaN(reject)) {
      const totalRawMaterial = (weight * price) / ((1 - scrap) * (1 - reject));
      onCostChange(totalRawMaterial); 
      return totalRawMaterial.toFixed(2);
    }
    return "0.00";
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
            value={materialWeight}
            onChange={(e) => setMaterialWeight(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Unit Price"
            fullWidth
            placeholder="Enter price"
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Scrap Rate (%)"
            fullWidth
            placeholder="Enter scrap rate"
            type="number"
            value={scrapRate}
            onChange={(e) => setScrapRate(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Rejected Rate (%)"
            fullWidth
            placeholder="Enter rejected rate"
            type="number"
            value={rejectedRate}
            onChange={(e) => setRejectedRate(e.target.value)}
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
