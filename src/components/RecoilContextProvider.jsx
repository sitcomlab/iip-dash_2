"use client";
import { RecoilRoot, atom } from "recoil";

/* This is where the atoms are declared
export const todoListState = atom({
    key: "TodoList",
    default: [],
  });
*/

//the state that determines which city is currently viewed.
//  New configs are stored within the page.js of each new city
export const cityViewConfigState = atom({
  key: "CityViewConfig",
  default: {
    name: "Münster",
    mapSettings: {
      center: [51.962, 7.627],
      zoom: 12,
    },
    infrastructureSource: process.env.NEXT_PUBLIC_BICYCLE_INFRASTRUCTURE_URL_MS,
  }, //default at Münster
});

export const mapLoadingState = atom({
  key: "mapLoading",
  default: false
})

//The following 3 states states dictate selection and display in the AdministrativeArea mapview
export const selectedAAState = atom({
  key: "selectedAA",
  default: "",
});
export const selectedAAFeatureState = atom({
  key: "selectedAAFeature",
  default: [],
});
/*
possible PointDataTypes include:
    false = 'keine',
    öffis = 'Öffis',
    service = 'Service',
    fahrradLaden = 'Fahrrad-Laden',
    diyStation = 'DIY-Station',
    radVerleih = 'Rad-Verleih',
    schlauchAutomat = 'Schlauch-Automat',
    parken = 'Parken',
    ladeStation = 'Ladestation',
    fahrradAmpel = 'Fahrrad-Ampel'
*/
export const displayedPointDataState = atom({
  key: "displayedPointData",
  default: false,
});

/*
possible settings
BicycleNetwork
Bikeability
Administrative Areas
*/
export const mapViewModeState = atom({
  key: "mapViewMode",
  //default: "BicycleNetwork",
  default: "Bikeability",
});

export const biWeightsState = atom({
  key: "biWeights",
  default: {
    safety: 0.4,
    infrastructure_quality: 0.5,
    environment_quality: 0.1,
  }
})

export default function RecoilContextProvider({ children }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
