"use client";
import { cityViewConfigState } from "@/components/RecoilContextProvider";
import { useRecoilState } from "recoil";
import Image from "next/image";
import dynamic from "next/dynamic";
import { createContext, useState, useEffect } from "react";

import { mapViewModeState } from "@components/RecoilContextProvider";

const AdminAreaInfoTile = dynamic(
  () => import("@/components/AdminAreaInfoTile"),
  { ssr: false },
);
import Navbar from "@/components/Elements/Navbar";
import PlusTile from "@/components/PlusTileMockup";
const BikeInfrastructTile = dynamic(
  () => import("@/components/BikeInfrastructTile/BicycleInfrastructTile"),
  { ssr: false },
);
import MapFeatureProvider from "@/components/MapFeatureProvider";
import { width } from "@mui/system";


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
    <main className="flex min-h-dvh w-dvw flex-col items-center justify-start gap-2 sm:gap-4 pt-4 h-screen">
      <Navbar className="w-full flex justify-left pl-10" />
      <MapContext.Provider value={mapValue}>
        <MapFeatureProvider city={cityViewConfig}>
          <div className="w-screen flex grow min-h-0 flex-col md:flex-row">

            {/* AdministrativeAreas view still uses a side tile; other views are map-only */}
            {mapViewState === "AdministrativeAreas" && (
              <div className="overflow-y-scroll min-w-0">
                <div className="grid grid-cols-1 gap-4 auto-rows-min">
                  <AdminAreaInfoTile />
                </div>
              </div>
            )}

            {/* The map — now full width */}
            <div className="flex-1 md:flex-grow-1 min-h-[60vh] m-2">
              <BikeInfrastructTile height="h-[49rem] h-full" width="w-auto" />
            </div>

          </div>
        </MapFeatureProvider>
      </MapContext.Provider>
    </main>
  );
}
