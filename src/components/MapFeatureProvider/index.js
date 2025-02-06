"use client";
//Provide three things
// 1. the full geojson of available map features
// 2. the map features currently to be displayed on the map
// 3. the ability to set 2.
// alternatively it might be a nice idea to also add the map context here.
// so it's all in one place'

//ok what is this? a hook? a component?
// I think this should be a wrapper component offering these things as contexts..

import { createContext, useState, useEffect } from "react";

import useBikeInfrastructData from "@/hooks/useBikeInfrastructure";

//mapfeaturecontext contains all the features that could be added to the map
// this means the bicycle infrastructure features, as well as any additional ones
// other processes can make use of that context to access and make use of these features.
export const MapFeatureContext = createContext({
  BikeInfrastructFeatures: null,
  setBikeInfrastructFeatures: () => {},
});

export const MapContentContext = createContext({
  MapContent: <></>,
  setMapContent: () => {},
});

export default function MapFeatureProvider(props) {
  const children = props.children;

  const bicycleInfrastructureData = useBikeInfrastructData(
    props.city.infrastructureSource,
  );

  const [bikeInfrastructFeatures, setBikeInfrastructFeatures] = useState(null);
  const bikeInfrastructFeaturesValue = {
    bikeInfrastructFeatures,
    setBikeInfrastructFeatures,
  };
  const [mapContent, setMapContent] = useState(<></>);
  const mapContentValue = {
    mapContent,
    setMapContent,
  };

  //this uses useBicycleInfrastructure hook:
  // upon update of this hook, the data will be updated.
  // in the bikeinfrastruct tile, this is accessed in BicycleInfrastructureData
  // and passed along to the BicycleInfrastructureFeatures component
  // where mapContent and setMapContent should maybe best be called(?)
  useEffect(() => {
    setBikeInfrastructFeatures(bicycleInfrastructureData);
  }, [bicycleInfrastructureData]);

  return (
    <>
      <MapFeatureContext.Provider value={bikeInfrastructFeaturesValue}>
        <MapContentContext.Provider value={mapContentValue}>
          {children}
        </MapContentContext.Provider>
      </MapFeatureContext.Provider>
    </>
  );
}
