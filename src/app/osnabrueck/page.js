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
    <main className="flex min-h-screen flex-col items-center justify-start gap-10 pt-24">
      <Image
        src="/icons/BicycleIconGreen.svg"
        alt="Vercel Logo"
        width={100}
        height={24}
        priority
      />
      <Navbar className="w-5/6  flex justify-center" />
      <MapContext.Provider value={mapValue}>
        <MapFeatureProvider city={cityViewConfig}>
          <div className="flex flex-container flex-wrap flex-row-reverse w-5/6">
            <BikeInfrastructTile height="h-[49rem]"></BikeInfrastructTile>

            <div className="flex flex-container flex-wrap justify-end w-2/6">
              {mapViewState === "AdministrativeAreas" && (
                <AdminAreaInfoTile></AdminAreaInfoTile>
              )}
              {mapViewState === "Bikeability" && (
                //<BikeabilityInfoTile></BikeabilityInfoTile>
                <BIWeightsControlTile></BIWeightsControlTile>
              )}
              <PlusTile></PlusTile>
            </div>
          </div>
        </MapFeatureProvider>
      </MapContext.Provider>
    </main>
  );
}
