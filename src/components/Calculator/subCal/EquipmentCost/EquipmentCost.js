import React from "react";
import { TextField, Typography, Box, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import { useCost } from "../../../../context/costContext";
import DeleteIcon from "@mui/icons-material/Delete";

function EquipmentCost({ onCostChange, rejectRate }) {
  const {
    equipmentCostData,
    setEquipmentCostData,
    addEquipment,
    removeEquipment,
  } = useCost(); // Get equipment data from context

  const calculateTotalEquipmentCost = () => {
    const totalCost = equipmentCostData.reduce((acc, equipment) => {
      const equipmentCostRate =
        equipment.equipInvest /
        (equipment.equipLife * equipment.equipAnnuAvilTime);
      const equipmentCost =
        (equipmentCostRate * equipment.equipTime) /
        ((1 - rejectRate / 100) * equipment.partsPerRun);
      return acc + (isNaN(equipmentCost) ? 0 : equipmentCost);
    }, 0);

    const roundedTotalCost = totalCost.toFixed(2);

    onCostChange(roundedTotalCost);
    return roundedTotalCost;
  };

  const handleChange = (index, field, value) => {
    setEquipmentCostData((prevData) =>
      prevData.map((equipment, i) =>
        i === index ? { ...equipment, [field]: value } : equipment
      )
    );
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
        Equipment Cost
      </Typography>
      {equipmentCostData.map((equipment, index) => (
        <Box key={index} mb={2} position={"relative"}>
          <Typography variant="subtitle1">Equipment {index + 1}</Typography>
          {equipmentCostData.length > 1 && (
            <Grid
              item
              xs={12}
              style={{ position: "absolute", right: "0", top: "-0.5rem" }}
            >
              <IconButton onClick={() => removeEquipment(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Equipment Name"
                fullWidth
                value={equipment.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Equipment Investment (&pound;)"
                fullWidth
                type="number"
                value={equipment.equipInvest}
                onChange={(e) =>
                  handleChange(index, "equipInvest", e.target.value)
                }
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Equipment Life"
                fullWidth
                type="number"
                value={equipment.equipLife}
                onChange={(e) =>
                  handleChange(index, "equipLife", e.target.value)
                }
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Annual Available Time (hrs)"
                fullWidth
                type="number"
                value={equipment.equipAnnuAvilTime}
                onChange={(e) =>
                  handleChange(index, "equipAnnuAvilTime", e.target.value)
                }
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Equipment Time (hrs)"
                fullWidth
                type="number"
                value={equipment.equipTime}
                onChange={(e) =>
                  handleChange(index, "equipTime", e.target.value)
                }
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Parts Per Run"
                fullWidth
                type="number"
                value={equipment.partsPerRun}
                onChange={(e) =>
                  handleChange(index, "partsPerRun", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={addEquipment}
        sx={{ mt: 2 }}
      >
        Add Equipment
      </Button>
      <Typography variant="body1" mt={2}>
        Total Equipment Cost: <strong>{calculateTotalEquipmentCost()}</strong>
      </Typography>
    </Box>
  );
}

export default EquipmentCost;
