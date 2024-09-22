import React, { createContext, useContext } from "react";

const CostContext = createContext();

export const CostProvider = ({ children }) => {
  const initialMaterialCost = [
    {
      name: "",
      materialWeight: "",
      unitPrice: "",
      scrapRate: "",
      rejectedRate: "",
      supportMaterialRate: "0",
      supportMaterials: [
        {
          name: "",
          materialWeight: "",
          unitPrice: "",
          scrapRate: "",
          rejectedRate: "",
        },
      ],
    },
  ];

  const initialEnergyCost = {
    consumptionRate: "",
    energyPrice: "",
  };

  const initialEquipmentCost = [
    {
      name: "",
      equipInvest: "",
      equipLife: "",
      equipAnnuAvilTime: "",
      equipTime: "",
      partsPerRun: "",
    },
  ];

  const initialLabourCost = [
    {
      type: "",
      labourRate: "",
      labourTime: "",
      partsPerRun: "",
      operators: "",
    },
  ];

  const initialToolingCost = {
    toolingInvestment: "",
    toolingLifeCycle: "",
  };

  const initialFacilityCost = {
    facilityInvestment: "",
    facilityLife: "",
    anualAvailableTimeDays: "",
    anualAvailableTimeHours: "",
  };

  const [materialCostData, setMaterialCostData] =
    React.useState(initialMaterialCost);
  const [supportMaterials, setSupportMaterials] = React.useState([]);
  const [energyCostData, setEnergyCostData] = React.useState(initialEnergyCost);
  const [equipmentCostData, setEquipmentCostData] =
    React.useState(initialEquipmentCost);
  const [labourCostData, setLabourCostData] = React.useState(initialLabourCost);
  const [toolingCostData, setToolingCostData] =
    React.useState(initialToolingCost);
  const [facilityCostData, setFacilityCostData] =
    React.useState(initialFacilityCost);

  const addMaterial = () => {
    setMaterialCostData((prevData) => [
      ...prevData,
      {
        name: "",
        materialWeight: "",
        unitPrice: "",
        scrapRate: "",
        rejectedRate: "",
        supportMaterialRate: "0",
      },
    ]);
  };

  const removeMaterial = (index) => {
    setMaterialCostData((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Add support material logic for "VARTM" process
  const addSupportMaterial = () => {
    setSupportMaterials((prevData) => [
      ...prevData,
      {
        name: "",
        materialWeight: "",
        unitPrice: "",
        scrapRate: "",
        rejectedRate: "",
      },
    ]);
  };

  const removeSupportMaterial = (index) => {
    setSupportMaterials((prevData) => prevData.filter((_, i) => i !== index));
  };

  // setSupportMaterials([...supportMaterials, { name: "", materialWeight: "", unitPrice: "", scrapRate: 0, rejectedRate: 0 }]);

  const addLabour = () => {
    setLabourCostData((prevData) => [
      ...prevData,
      {
        type: "",
        labourRate: "",
        labourTime: "",
        operators: "",
      },
    ]);
  };

  const removeLabour = (index) => {
    setLabourCostData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const addEquipment = () => {
    setEquipmentCostData((prevData) => [
      ...prevData,
      {
        name: "",
        equipInvest: "",
        equipLife: "",
        equipAnnuAvilTime: "",
        equipTime: "",
        partsPerRun: "",
      },
    ]);
  };

  const removeEquipment = (index) => {
    setEquipmentCostData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const resetAllCosts = () => {
    setMaterialCostData(initialMaterialCost);
    setSupportMaterials(initialMaterialCost[0].supportMaterials);
    setEnergyCostData(initialEnergyCost);
    setEquipmentCostData(initialEquipmentCost);
    setLabourCostData(initialLabourCost);
    setToolingCostData(initialToolingCost);
    setFacilityCostData(initialFacilityCost);
  };

  return (
    <CostContext.Provider
      value={{
        materialCostData,
        setMaterialCostData,
        supportMaterials,
        setSupportMaterials,
        addMaterial,
        removeMaterial,
        addSupportMaterial,
        removeSupportMaterial,
        energyCostData,
        setEnergyCostData,
        equipmentCostData,
        setEquipmentCostData,
        addEquipment,
        removeEquipment,
        labourCostData,
        setLabourCostData,
        addLabour,
        removeLabour,
        toolingCostData,
        setToolingCostData,
        facilityCostData,
        setFacilityCostData,
        resetAllCosts,
      }}
    >
      {children}
    </CostContext.Provider>
  );
};

export const useCost = () => useContext(CostContext);
