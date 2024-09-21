import React, { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Box,
  Button,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCost } from "../../../../context/costContext";
// import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function roundedValue(value) {
  return Math.round(value * 100) / 100;
}

function MaterialCost({
  onCostChange,
  rejectRate,
  materialScrapRate,
  selectedProcess,
}) {
  const { materialCostData, setMaterialCostData, addMaterial, removeMaterial } =
    useCost();
  const {
    supportMaterials,
    setSupportMaterials,
    addSupportMaterial,
    removeSupportMaterial,
  } = useCost();
  const [supportCostOption, setSupportCostOption] = useState("rate"); // "rate" or "addMaterials"
  const [totalSupportMaterialCostRate, setTotalSupportMaterialCostRate] =
    useState(0);
  // const [supportMaterials, setSupportMaterials] = useState([]);

  useEffect(() => {
    rejectRate(
      materialCostData
        .map((material) => material.rejectedRate)
        .reduce((acc, rate) => acc + parseFloat(rate || 0), 0)
    );
    materialScrapRate(
      materialCostData
        .map((material) => material.scrapRate)
        .reduce((acc, rate) => acc + parseFloat(rate || 0), 0)
    );
  }, [materialCostData, rejectRate, materialScrapRate]);

  const handleChange = (index, field, value) => {
    const updatedMaterials = materialCostData.map((material, i) =>
      i === index ? { ...material, [field]: value } : material
    );
    setMaterialCostData(updatedMaterials);
  };

  const handleSupportMaterialChange = (index, field, value) => {
    const updatedMaterials = supportMaterials.map((material, i) =>
      i === index ? { ...material, [field]: value } : material
    );
    setSupportMaterials(updatedMaterials);
  };

  const calculateCosts = (material) => {
    const weight = parseFloat(material.materialWeight);
    const price = parseFloat(material.unitPrice);
    const scrap = parseFloat(material.scrapRate) / 100;
    const reject = parseFloat(material.rejectedRate) / 100;
    const supportRate = parseFloat(material.supportMaterialRate) / 100;

    if (
      !isNaN(weight) &&
      !isNaN(price) &&
      !isNaN(scrap) &&
      !isNaN(reject) &&
      !isNaN(supportRate)
    ) {
      let rawMaterialCost = (weight * price) / ((1 - scrap) * (1 - reject));
      let supportMaterialCost = rawMaterialCost * supportRate;
      return {
        rawMaterialCost: roundedValue(rawMaterialCost),
        supportMaterialCost: roundedValue(supportMaterialCost),
      };
    }
    return {
      rawMaterialCost: 0,
      supportMaterialCost: 0,
    };
  };

  const totalRawMaterialCost = materialCostData.reduce((acc, material) => {
    const { rawMaterialCost } = calculateCosts(material);
    return acc + rawMaterialCost;
  }, 0);

  // Calculate total support material cost based on the selected option
  const calculateSupportMaterialCost = () => {
    if (supportCostOption === "rate") {
      return roundedValue(
        (totalRawMaterialCost * totalSupportMaterialCostRate) / 100
      );
    } else {
      return supportMaterials.reduce((acc, material) => {
        const { rawMaterialCost } = calculateCosts(material);
        return acc + rawMaterialCost;
      }, 0);
    }
  };

  const totalCosts = materialCostData.reduce(
    (acc, material) => {
      const { rawMaterialCost, supportMaterialCost } = calculateCosts(material);
      return {
        totalRawMaterialCost: acc.totalRawMaterialCost + rawMaterialCost,
        totalSupportMaterialCost:
          acc.totalSupportMaterialCost + supportMaterialCost,
      };
    },
    { totalRawMaterialCost: 0, totalSupportMaterialCost: 0 }
  );

  const totalCost = roundedValue(
    totalCosts.totalRawMaterialCost + totalCosts.totalSupportMaterialCost
  );

  const totalSupportMaterialCost = calculateSupportMaterialCost();
  // const totalCost = roundedValue(
  //   totalRawMaterialCost + totalSupportMaterialCost
  // );

  useEffect(() => {
    onCostChange(totalCost);
    console.log("Material Cost: ", totalCost);
  }, [totalCost, onCostChange]);

  // Add and remove support materials
  // const addSupportMaterial = () => {
  //   setSupportMaterials([...supportMaterials, { name: "", materialWeight: "", unitPrice: "", scrapRate: 0, rejectedRate: 0 }]);
  // };

  // const removeSupportMaterial = (index) => {
  //   setSupportMaterials(supportMaterials.filter((_, i) => i !== index));
  // };

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
        Material Costs
      </Typography>

      {materialCostData.map((material, index) => {
        const { rawMaterialCost, supportMaterialCost } =
          calculateCosts(material);
        return (
          <Grid container spacing={2} key={index} mb={2}>
            <Grid item size={{ xs: 12 }} style={{ position: "relative" }}>
              <Typography variant="subtitle1">Material {index + 1}</Typography>
              {materialCostData.length > 1 && (
                <Grid
                  item
                  xs={12}
                  style={{ position: "absolute", right: "0", top: "-0.5rem" }}
                >
                  <IconButton
                    onClick={() => removeMaterial(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <TextField
                label="Material Name"
                fullWidth
                value={material.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Part Mat. Weight(KG)"
                fullWidth
                type="number"
                value={material.materialWeight}
                onChange={(e) =>
                  handleChange(index, "materialWeight", e.target.value)
                }
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Unit Price (&pound;/KG)"
                fullWidth
                type="number"
                value={material.unitPrice}
                onChange={(e) =>
                  handleChange(index, "unitPrice", e.target.value)
                }
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Scrap Rate (%)"
                fullWidth
                type="number"
                value={material.scrapRate}
                onChange={(e) =>
                  handleChange(index, "scrapRate", e.target.value)
                }
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Rejected Rate (%)"
                fullWidth
                type="number"
                value={material.rejectedRate}
                onChange={(e) =>
                  handleChange(index, "rejectedRate", e.target.value)
                }
              />
            </Grid>
            {selectedProcess !== "VARTM" && (
              <Grid item size={{ xs: 12 }}>
                <TextField
                  label="Support Material Rate (%)"
                  fullWidth
                  type="number"
                  value={material.supportMaterialRate}
                  onChange={(e) =>
                    handleChange(index, "supportMaterialRate", e.target.value)
                  }
                />
                <Typography variant="body1" mt={2}>
                  Support Material Cost: <strong>{supportMaterialCost}</strong>
                </Typography>
              </Grid>
            )}
            <Typography variant="body1">
              Raw Material Cost: <strong>{rawMaterialCost}</strong>
            </Typography>
          </Grid>
        );
      })}

      <Button
        variant="contained"
        color="primary"
        onClick={addMaterial}
        sx={{ mt: 2 }}
      >
        Add Material
      </Button>

      {selectedProcess === "VARTM" && (
        <>
          <Typography variant="h6" mt={4}>
            Support Material Cost Options
          </Typography>

          <RadioGroup
            value={supportCostOption}
            onChange={(e) => setSupportCostOption(e.target.value)}
          >
            <FormControlLabel
              value="rate"
              control={<Radio />}
              label="Use a support material cost rate (%)"
            />
            <FormControlLabel
              value="addMaterials"
              control={<Radio />}
              label="Add individual support materials"
            />
          </RadioGroup>

          {supportCostOption === "rate" ? (
            <TextField
              label="Support Material Cost to Raw Material Cost Rate (%)"
              fullWidth
              type="number"
              value={totalSupportMaterialCostRate}
              onChange={(e) => setTotalSupportMaterialCostRate(e.target.value)}
            />
          ) : (
            <>
              {supportMaterials.map((material, index) => (
                <Grid container spacing={2} key={index} mb={2}>
                  <Grid item size={{ xs: 12 }} style={{ position: "relative" }}>
                    <Typography variant="subtitle1">
                      Support Material {index + 1}
                    </Typography>
                    <IconButton
                      onClick={() => removeSupportMaterial(index)}
                      color="error"
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "-0.5rem",
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <TextField
                      label="Part Mat. Weight(KG)"
                      fullWidth
                      type="number"
                      value={material.materialWeight}
                      onChange={(e) =>
                        handleSupportMaterialChange(
                          index,
                          "materialWeight",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <TextField
                      label="Unit Price (&pound;/KG)"
                      fullWidth
                      type="number"
                      value={material.unitPrice}
                      onChange={(e) =>
                        handleSupportMaterialChange(
                          index,
                          "unitPrice",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <TextField
                      label="Scrap Rate (%)"
                      fullWidth
                      type="number"
                      value={material.scrapRate}
                      onChange={(e) =>
                        handleSupportMaterialChange(
                          index,
                          "scrapRate",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item size={{ xs: 6 }}>
                    <TextField
                      label="Rejected Rate (%)"
                      fullWidth
                      type="number"
                      value={material.rejectedRate}
                      onChange={(e) =>
                        handleSupportMaterialChange(
                          index,
                          "rejectedRate",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Typography variant="body1">
                    Support Material Cost:{" "}
                    <strong>
                      {calculateSupportMaterialCost(material).rawMaterialCost}
                    </strong>
                  </Typography>
                </Grid>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={addSupportMaterial}
                sx={{ mt: 2 }}
              >
                Add Support Material
              </Button>
            </>
          )}
        </>
      )}

      <Typography variant="body1" mt={4}>
        Total Raw Material Cost: <strong>{totalRawMaterialCost}</strong>
      </Typography>
      <Typography variant="body1">
        Total Support Material Cost: <strong>{totalSupportMaterialCost}</strong>
      </Typography>
      <Typography variant="h6">
        Total Material Cost: <strong>{totalCost}</strong>
      </Typography>
    </Box>
  );
}

export default MaterialCost;
