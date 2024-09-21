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
import DeleteIcon from "@mui/icons-material/Delete";

function roundedValue(value) {
  return Math.round(value * 100) / 100;
}

function MaterialCost({
  onCostChange,
  rejectRate,
  materialScrapRate,
  onWeightsChange,
  selectedProcess,
  onRejectRatesChange, // New prop to pass rejected rates
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

  // Calculate rejected rates array
  const rejectedRates = materialCostData.map((material) =>
    parseFloat(material.rejectedRate || 0)
  );

  const scrapRates = materialCostData.map((material) =>
    parseFloat(material.scrapRate || 0)
  );
  const materialWeights = materialCostData.map((material) =>
    parseFloat(material.materialWeight || 0)
  );

  useEffect(() => {
    // Update parent component with the array of rejected rates
    if (onRejectRatesChange) {
      onRejectRatesChange(rejectedRates);
    }

    if (onWeightsChange) {
      onWeightsChange(materialWeights); // Pass material weights to the parent component
    }

    // Existing calculations for rejectRate and materialScrapRate
    rejectRate(
      materialCostData
        .map((material) => material.rejectedRate)
        .reduce((acc, rate) => acc + parseFloat(rate || 0), 0)
    );
    if (materialScrapRate) {
      materialScrapRate(scrapRates);
    }
  }, [
    materialCostData,
    rejectRate,
    materialScrapRate,
    rejectedRates,
    onRejectRatesChange,
    materialWeights,
    onWeightsChange,
    scrapRates,
  ]);

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

  const calculateIndividualSupportMaterialCost = (material) => {
    const weight = parseFloat(material.materialWeight);
    const price = parseFloat(material.unitPrice);
    const scrap = parseFloat(material.scrapRate) / 100;
    const reject = parseFloat(material.rejectedRate) / 100;

    if (!isNaN(weight) && !isNaN(price) && !isNaN(scrap) && !isNaN(reject)) {
      let rawMaterialCost = (weight * price) / ((1 - scrap) * (1 - reject));
      return roundedValue(rawMaterialCost);
    }
    return 0;
  };

  // Calculate total support material cost based on the selected option
  const calculateSupportMaterialCost = () => {
    if (supportCostOption === "rate") {
      return roundedValue(
        (totalRawMaterialCost * totalSupportMaterialCostRate) / 100
      );
    } else {
      return supportMaterials.reduce((acc, material) => {
        const individualCost = calculateIndividualSupportMaterialCost(material);
        return acc + individualCost;
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

  const totalSupportMaterialCost = calculateSupportMaterialCost();
  const totalCost = roundedValue(
    totalCosts.totalRawMaterialCost +
      (totalCosts.totalSupportMaterialCost || totalSupportMaterialCost)
  );

  useEffect(() => {
    onCostChange(totalCost);
    console.log("Material Cost: ", totalCost);
  }, [totalCost, onCostChange, totalSupportMaterialCost]);

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
            Support Material Cost
          </Typography>

          <RadioGroup
            row
            value={supportCostOption}
            onChange={(e) => setSupportCostOption(e.target.value)}
          >
            <FormControlLabel
              value="rate"
              control={<Radio />}
              label="Support Material Cost Rate (%)"
            />
            <FormControlLabel
              value="addMaterials"
              control={<Radio />}
              label="Add Support Materials"
            />
          </RadioGroup>

          {supportCostOption === "rate" ? (
            <>
              <TextField
                label="Support Material Cost Rate (%)"
                fullWidth
                type="number"
                value={totalSupportMaterialCostRate}
                onChange={(e) =>
                  setTotalSupportMaterialCostRate(e.target.value)
                }
              />
              <Typography variant="body1" mt={2}>
                Support Material Cost:{" "}
                <strong>{totalSupportMaterialCost}</strong>
              </Typography>
            </>
          ) : (
            <>
              {supportMaterials.map((material, index) => (
                <Grid container spacing={2} key={index} mb={2}>
                  <Grid item size={{ xs: 12 }}>
                    <Typography variant="subtitle1">
                      Support Material {index + 1}
                    </Typography>
                    {supportMaterials.length > 1 && (
                      <Grid
                        item
                        xs={12}
                        style={{
                          position: "absolute",
                          right: "0",
                          top: "-0.5rem",
                        }}
                      >
                        <IconButton
                          onClick={() => removeSupportMaterial(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item size={{ xs: 6 }}>
                    <TextField
                      label="Material Weight(KG)"
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
    </Box>
  );
}

export default MaterialCost;
