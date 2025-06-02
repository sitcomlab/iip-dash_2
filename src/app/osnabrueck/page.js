"use client";
import { cityViewConfigState } from "@/components/RecoilContextProvider";
import { useRecoilState } from "recoil";
import Image from "next/image";
import dynamic from "next/dynamic";
import { createContext, useState } from "react";

import { mapViewModeState } from "@components/RecoilContextProvider";
import BikeabilityInfoTile from "@/components/BikeabilityInfoTile";
import BIWeightsControlTile from "@/components/BIWeightsControlTile";
import Navbar from "@/components/Elements/Navbar";
import AdminAreaInfoTile from "@/components/AdminAreaInfoTile";
const BikeInfrastructTile = dynamic(
  () => import("@/components/BikeInfrastructTile/BicycleInfrastructTile"),
  { ssr: false },
);
import PlusTile from "@/components/PlusTileMockup";
import MapFeatureProvider from "@/components/MapFeatureProvider";

export const MapContext = createContext({
  mapRef: {},
  setMapRef: () => {},
});

const cityConfig = {
  name: "Osnabrück",
  mapSettings: {
    center: [52.279, 8.047],
    zoom: 12,
  },
  infrastructureSource: process.env.NEXT_PUBLIC_BICYCLE_INFRASTRUCTURE_URL_OS,
  bikeabilitySource: process.env.NEXT_PUBLIC_BIKEABILITY_API_URL_OS,
  anonymizationSource: process.env.NEXT_PUBLIC_ANONYMIZATION_API_URL_OS,
  biSegmentSource: process.env.NEXT_PUBLIC_OSM_BIKEABILITY_API_URL_OS,
};

export default function Osnabrück() {
  const [mapRef, setMapRef] = useState(null);
  const mapValue = { mapRef, setMapRef };

  const [cityViewConfig, setCityViewConfig] =
    useRecoilState(cityViewConfigState);
  const [mapViewState] = useRecoilState(mapViewModeState); // Get the current map view state
  setCityViewConfig(cityConfig);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-2 sm:gap-4 pt-4 h-screen">
      <Navbar className="w-full flex justify-left ml-10" />
      <MapContext.Provider value={mapValue}>
        <MapFeatureProvider city={cityViewConfig}>
          <div
            className="w-screen flex grow min-h-0 md:flex-row flex-col-reverse"
          >
            {/* scroll wrapper */}
            <div className="overflow-y-scroll min-w-0">
              {/* scrollable container */}
              <div
              className="
              grid
              2xl:grid-cols-[min-content,min-content]
              xl:grid-cols-[min-content]
              lg:grid-cols-[min-content]
              md:grid-cols-[min-content]

              ">
              {mapViewState === "AdministrativeAreas" && (
                <AdminAreaInfoTile></AdminAreaInfoTile>
              )}
              {mapViewState === "Bikeability" && (
                <>
                <BIWeightsControlTile></BIWeightsControlTile>
                <BikeabilityInfoTile></BikeabilityInfoTile>
                <PlusTile></PlusTile>
                </>
              )}
              {mapViewState === "AdministrativeAreas" && <PlusTile></PlusTile>}
              </div>
          </div>

          {/* Fixed sidebar */}
          <div class="flex-1 md:flex-grow-1 min-h-[50vh] min-h-1/2 m-2">
          <BikeInfrastructTile height="h-[49rem] h-full" width="w-auto"></BikeInfrastructTile>
          </div>

          </div>
        </MapFeatureProvider>
      </MapContext.Provider>
    </main>
  );
}
