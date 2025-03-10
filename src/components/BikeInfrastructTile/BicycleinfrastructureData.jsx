"use client";
import { useRecoilValue, useRecoilState } from "recoil"; // Import useRecoilState
import { useContext } from "react";

import useBikeInfrastructData from '@/hooks/useBikeInfrastructure'; // Correct import path
import { cityViewConfigState } from "@components/RecoilContextProvider";
import { mapViewModeState } from "./BicycleInfrastructTile";
import LayerControl from "./LayerControl/LayerControl";
import Legend from "./LayerControl/Legend";

import AdministrativeAreas from "./mapContent/AdministrativeAreas";
import BicycleInfrastructureFeatures from "./mapContent/BicycleInfrastructureFeatures";
import { MapFeatureContext, LayersControlContext } from "../MapFeatureProvider";

import Bikeability from './mapContent/Bikeability';

const BicycleinfrastructureData = () => {
  const cityConfig = useRecoilValue(cityViewConfigState); // Get the current city config
  const { bikeInfrastructFeatures, bikeabilityFeatures } = useContext(MapFeatureContext); // Access features from context
  const [mapViewState] = useRecoilState(mapViewModeState); // Get the current map view state

  return (
    <>
      {mapViewState === "AdministrativeAreas" && (
        <LayerControl position="bottomright">
          <AdministrativeAreas contentGeometry={bikeInfrastructFeatures} />
        </LayerControl>
      )}

      {mapViewState === "BicycleNetwork" && (
        <LayerControl position="bottomright">
          <Legend position="bottomleft">
            <BicycleInfrastructureFeatures
              contentGeometry={bikeInfrastructFeatures}
            />
          </Legend>
        </LayerControl>
      )}

      {mapViewState === "Bikeability" && (
        <LayerControl position="bottomright">
          <Legend position="bottomleft">
            <Bikeability 
              contentGeometry={bikeabilityFeatures}
              name="Bikeability" // Add name prop for legend
            />
          </Legend>
        </LayerControl>
      )}


    </>
  );
}

export default BicycleinfrastructureData;
