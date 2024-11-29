"use client";
import { useRecoilState } from "recoil";
import { useContext } from "react";

import useBikeInfrastructData from "@/hooks/useBikeInfrastructure";
import { cityViewConfigState } from "@components/RecoilContextProvider";
import { mapViewModeState } from "./BicycleInfrastructTile";
import LayerControl from "./LayerControl/LayerControl";
import Legend from "./LayerControl/Legend";

import AdministrativeAreas from "./mapContent/AdministrativeAreas";
import BicycleInfrastructureFeatures from "./mapContent/BicycleInfrastructureFeatures";
import { MapFeatureContext } from "../MapFeatureProvider";

function BicycleInfrastructureData(map) {
  //regularly fetch bike infrastructure data
  //  get the city which we are looking at, and pass that to the bike infrastructure hook
  const [CityViewConfig] = useRecoilState(cityViewConfigState);
  var { bikeInfrastructFeatures, setBikeInfrastructFeatures } =
    useContext(MapFeatureContext);

  //var bicycleInfrastructureData = useBikeInfrastructData(
  //  CityViewConfig.infrastructureSource,
  //);

  const [mapViewState] = useRecoilState(mapViewModeState);

  return (
    <>
      {mapViewState == "AdministrativeAreas" && (
        //TODO: LayerControl, AndiminstrativeAreas component
        <LayerControl position="bottomright">
          <AdministrativeAreas contentGeometry={bikeInfrastructFeatures} />
        </LayerControl>
      )}

      {mapViewState == "BicycleNetwork" && (
        <LayerControl position="bottomright">
          <Legend position="bottomleft">
            <BicycleInfrastructureFeatures
              contentGeometry={bikeInfrastructFeatures}
            />
            <></>
          </Legend>
          <></>
        </LayerControl>
      )}
    </>
  );
}

export default BicycleInfrastructureData;
