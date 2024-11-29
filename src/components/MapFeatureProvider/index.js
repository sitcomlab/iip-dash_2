"use client";
//Provide three things
// 1. the full geojson of available map features
// 2. the map features currently to be displayed on the map
// 3. the ability to set 2.
// alternatively it might be a nice idea to also add the map context here.
// so it's all in one place'

//ok what is this? a hook? a component?
// I think this should be a wrapper component offering these things as contexts..
// does an updated context update the map?

import { createContext, useState, useEffect } from "react";

//placeholder for the bikeinfrastructure-hook
import { ms_json } from "./ms_json";

export const MapFeatureContext = createContext({
  BikeInfrastructFeatures: null,
  setBikeInfrastructFeatures: () => {},
});

export const MapContentContext = createContext({
  MapContent: {},
  setMapContent: () => {},
});

export default function MapFeatureProvider(props) {
  const children = props.children;

  const [bikeInfrastructFeatures, setBikeInfrastructFeatures] = useState(null);
  const bikeInfrastructFeaturesValue = {
    bikeInfrastructFeatures,
    setBikeInfrastructFeatures,
  };
  const [mapContent, setMapContent] = useState({});
  const mapContentValue = {
    mapContent,
    setMapContent,
  };

  //this will later use the useBicycleInfrastructure hook:
  // in the bikeinfrastruct tile, this is accessed in BicycleInfrastructureData
  // and passed along to the BicycleInfrastructureFeatures component
  // where mapContent and setMapContent should maybe best be called(?)
  useEffect(() => {
    //this is not called as you originally intended.
    // at thispoint this won't make an issue but when the hook is implemented
    // you will have to think long and hard about it.
    // EDit: it seems to properly run after a few re-renders. not sure why it waits.
    setBikeInfrastructFeatures(ms_json);
  }, []);

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
