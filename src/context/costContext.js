import React, { createContext, useContext } from "react";

const CostContext = createContext();

export const CostProvider = ({ children }) => {
    const initialMaterialCost = {
      materialWeight: "",
      unitPrice: "",
      scrapRate: "",
      rejectedRate: "",
    };
  
    const initialEnergyCost = {
      consumptionRate: "",
      energyPrice: "",
    };
  
    const initialEquipmentCost = {
      equipInvest: "",
      equipLife: "",
      equipAnnuAvilTime: "",
      equipTime: "",
    };
  
    const initialLaborCost = {
      laborRate: "",
      laborTime: "",
      partsPerRun: "",
    };
  
    const initialToolingCost = {
      toolingInvestment: "",
      toolingLifeCycle: "",
    };
  
    const initialFacilityCost = {
      facilityInvestment: "",
      facilityLife: "",
      anualAvailableTime: "",
      processTime: "",
    };
  
    const [materialCostData, setMaterialCostData] = React.useState(initialMaterialCost);
    const [energyCostData, setEnergyCostData] = React.useState(initialEnergyCost);
    const [equipmentCostData, setEquipmentCostData] = React.useState(initialEquipmentCost);
    const [laborCostData, setLaborCostData] = React.useState(initialLaborCost);
    const [toolingCostData, setToolingCostData] = React.useState(initialToolingCost);
    const [facilityCostData, setFacilityCostData] = React.useState(initialFacilityCost);
  
    const resetAllCosts = () => {
      setMaterialCostData(initialMaterialCost);
      setEnergyCostData(initialEnergyCost);
      setEquipmentCostData(initialEquipmentCost);
      setLaborCostData(initialLaborCost);
      setToolingCostData(initialToolingCost);
      setFacilityCostData(initialFacilityCost);
    };
  
    return (
      <CostContext.Provider
        value={{
          materialCostData,
          setMaterialCostData,
          energyCostData,
          setEnergyCostData,
          equipmentCostData,
          setEquipmentCostData,
          laborCostData,
          setLaborCostData,
          toolingCostData,
          setToolingCostData,
          facilityCostData,
          setFacilityCostData,
          resetAllCosts, // Provide reset function
        }}
      >
        {children}
      </CostContext.Provider>
    );
  };

export const useCost = () => useContext(CostContext);
