"use client";
import { cityViewConfigState } from "@/components/RecoilContextProvider";
import { useRecoilState } from "recoil";
import Image from "next/image";
import dynamic from "next/dynamic";
import { createContext, useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";

import { mapViewModeState } from "@components/RecoilContextProvider";
import BikeabilityInfoTile from "@/components/BikeabilityInfoTile";
import BIWeightsControlTile from "@/components/BIWeightsControlTile";
import Navbar from "@/components/Elements/Navbar";
//import AdminAreaInfoTile from "@/components/AdminAreaInfoTile";
const AdminAreaInfoTile = dynamic(
  () => import("@/components/AdminAreaInfoTile"),
  { ssr: false },
);
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

  // --- foldable side panel state ---
  // panelCollapsed = true  -> panel hidden, map full width
  // panelCollapsed = false -> panel visible (normal desktop view)
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  // On first load, auto-collapse on iPad-ish / smaller screens (< 1280px),
  // but leave it open on wide desktop screens. Runs once after mount.
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      setPanelCollapsed(true);
    }
  }, []);

  // Toggle handler. After the layout changes, we "nudge" the map so Leaflet
  // notices the new width and redraws its tiles (prevents gray-tile gaps).
  const togglePanel = () => {
    setPanelCollapsed((prev) => !prev);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 250);
  };

  return (
    <main className="flex min-h-dvh w-dvw flex-col items-center justify-start gap-2 sm:gap-4 pt-4 h-screen">
      <Navbar className="w-full flex justify-left pl-10" />
      <MapContext.Provider value={mapValue}>
        <MapFeatureProvider city={cityViewConfig}>
          <div
            className="w-screen flex grow min-h-0 md:flex-row flex-col-reverse"
          >
            {/* scroll wrapper — hidden when panel is collapsed */}
            <div className={`overflow-y-scroll min-w-0 ${panelCollapsed ? "hidden" : ""}`}>
              {/* scrollable container */}
              <div
              className="
              grid
              grid-cols-1 lg:grid-cols-1 gap-4 auto-rows-min


              ">
              {mapViewState === "AdministrativeAreas" && (
                <AdminAreaInfoTile></AdminAreaInfoTile>
              )}
              {/*mapViewState === "Bikeability" && (
                <>
                <BIWeightsControlTile></BIWeightsControlTile>
                <BikeabilityInfoTile></BikeabilityInfoTile>
                </>
              )}
              {mapViewState === "BicycleNetwork" && (
                <>
                <BIWeightsControlTile></BIWeightsControlTile>
                <BikeabilityInfoTile></BikeabilityInfoTile>
                </>
              )

              While there is no difference between the views, conditional rendering is not necessary*/}

              <>
              <BIWeightsControlTile></BIWeightsControlTile>
              <BikeabilityInfoTile></BikeabilityInfoTile>
              </>
              </div>
          </div>

          {/* --- fold/unfold toggle button (compact burger) --- */}
          <div className="flex items-start justify-center">
            <button
              onClick={togglePanel}
              aria-label={panelCollapsed ? "Statistiken einblenden" : "Statistiken ausblenden"}
              title={panelCollapsed ? "Statistiken einblenden" : "Statistiken ausblenden"}
              className="bg-white shadow-md rounded-full p-2 m-1 text-gray-700 hover:bg-gray-100"
            >
              <MenuIcon fontSize="small" />
            </button>
          </div>

          {/* Fixed sidebar (the map) */}
          <div className="flex-1 md:flex-grow-1 min-h-[60vh] min-h-1/2 m-2">
          <BikeInfrastructTile height="h-[49rem] h-full" width="w-auto"></BikeInfrastructTile>
          </div>

          </div>
        </MapFeatureProvider>
      </MapContext.Provider>
    </main>
  );
}


// className="
// grid
// 2xl:grid-cols-[min-content,min-content]
// xl:grid-cols-[min-content]
// lg:grid-cols-[min-content]
// md:grid-cols-[min-content]

// ">
