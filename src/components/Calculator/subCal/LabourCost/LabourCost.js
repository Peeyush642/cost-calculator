import React, { useEffect } from "react";
import { TextField, Typography, Box, Button, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCost } from "../../../../context/costContext";
// import { use } from "framer-motion/client";
import DeleteIcon from "@mui/icons-material/Delete";
function roundedValue(value) {
  return Math.round(value * 100) / 100;
}

function LabourCost({ onCostChange, rejectRate }) {
  const { labourCostData, setLabourCostData, addLabour, removeLabour } =
    useCost(); // Get labour data from context

  // useEffect(() => {
  //   labourPartsPerRun(labourCostData.partsPerRun);
  // }, [labourCostData.partsPerRun, labourPartsPerRun]);

  const handleChange = (index, field, value) => {
    const updatedLabourData = labourCostData.map((labour, i) =>
      i === index ? { ...labour, [field]: value } : labour
    );
    setLabourCostData(updatedLabourData);
  };

  const calculateLabourCost = (labour) => {
    const time = parseFloat(labour.labourTime);
    const rate = parseFloat(labour.labourRate);
    const operators = parseFloat(labour.operators);
    const reject = parseFloat(rejectRate) / 100;
    const labourPartsPerRun = parseFloat(labour.partsPerRun);

    if (!isNaN(time) && !isNaN(rate) && !isNaN(operators) && !isNaN(reject)) {
      const labourCost =
        ((time * rate * operators) / (1 - reject)) * labourPartsPerRun;
      return labourCost.toFixed(2);
    }
    return "0.00";
  };

  const totalCosts = labourCostData.reduce(
    (acc, labour) => acc + parseFloat(calculateLabourCost(labour) || 0),
    0
  );
  const totalLabourCost = roundedValue(totalCosts);

  useEffect(() => {
    onCostChange(totalLabourCost);
    console.log("labour", totalLabourCost);
  }, [totalLabourCost, onCostChange]);

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
        Labour Costs
      </Typography>
      {labourCostData.map((labour, index) => (
        <Grid container spacing={2} key={index} mt={4}>
          <Grid item size={{ xs: 6 }}>
            <TextField
              label="Labour Type"
              fullWidth
              value={labour.type}
              onChange={(e) => handleChange(index, "type", e.target.value)}
            />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <TextField
              label="Number of Operators"
              fullWidth
              type="number"
              value={labour.operators}
              onChange={(e) => handleChange(index, "operators", e.target.value)}
            />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <TextField
              label="Labour Time (hrs)"
              fullWidth
              type="number"
              value={labour.labourTime}
              onChange={(e) =>
                handleChange(index, "labourTime", e.target.value)
              }
            />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <TextField
              label="Parts Per Run"
              fullWidth
              type="number"
              value={labour.partsPerRun}
              onChange={(e) =>
                handleChange(index, "partsPerRun", e.target.value)
              }
            />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <TextField
              label="Labour Rate (%)"
              fullWidth
              type="number"
              value={labour.labourRate}
              onChange={(e) =>
                handleChange(index, "labourRate", e.target.value)
              }
            />
          </Grid>
          <Typography variant="body1" mt={1}>
            Labour Cost: <strong>{calculateLabourCost(labour)}</strong>
          </Typography>
          {labourCostData.length > 1 && (
            // <Button
            //   variant="outlined"
            //   color="secondary"
            //   onClick={() => removeLabour(index)}
            //   sx={{ mt: 2 }}
            // >
            //   Remove Labour
            // </Button>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => removeLabour(index)}
              sx={{ mt: 2 }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Grid>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={addLabour}
        sx={{ mt: 2 }}
      >
        Add Labour
      </Button>
      <Typography variant="h6" mt={2}>
        Total Labour Cost: <strong>{totalLabourCost}</strong>
      </Typography>
    </Box>
  );
}

export default LabourCost;
