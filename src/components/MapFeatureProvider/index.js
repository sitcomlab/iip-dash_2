"use client";
// Provide three things
// 1. the full geojson of available map features
// 2. the map features currently to be displayed on the map
// 3. the ability to set 2.
// alternatively it might be a nice idea to also add the map context here.
// so it's all in one place

import { createContext, useState, useEffect } from "react";
import useBikeInfrastructData from '@/hooks/useBikeInfrastructure'; // Correct import path
import useBikeabilityData from '@/hooks/useBikeabilityData'; // Import the bikeability data hook

export const MapFeatureContext = createContext({
  bikeInfrastructFeatures: null,
  setBikeInfrastructFeatures: () => {},
  bikeabilityFeatures: null,
  setBikeabilityFeatures: () => {},
  biSegmentFeatures: null,
  setBISegmentFeatures: () => {},
  anonymizedFeatures: null,
  setAnonymizedFeatures: () => {},
});

export const MapContentContext = createContext({
  mapContent: <></>,
  setMapContent: () => {},
});

export default function MapFeatureProvider(props) {
  const children = props.children;

  const bicycleInfrastructureData = useBikeInfrastructData(props.city.infrastructureSource);
  const bikeabilityData = useBikeabilityData(props.city.bikeabilitySource); // Fetch bikeability data
  const biSegmentData = useBikeabilityData(props.city.biSegmentSource);
  // console.log(biSegmentData)
  const anonymizedData = useBikeabilityData(props.city.anonymizationSource);

  const [bikeInfrastructFeatures, setBikeInfrastructFeatures] = useState(null);
  const [bikeabilityFeatures, setBikeabilityFeatures] = useState(null); // New state for bikeability features
  const [biSegmentFeatures, setBISegmentFeatures] = useState(null);
  const [anonymizedFeatures, setAnonymizedFeatures] = useState(null);

  const bikeInfrastructFeaturesValue = {
    bikeInfrastructFeatures,
    setBikeInfrastructFeatures,
    bikeabilityFeatures,
    setBikeabilityFeatures,
    biSegmentFeatures,
    setBISegmentFeatures,
    anonymizedFeatures,
    setAnonymizedFeatures, // Add to context value
  };

  useEffect(() => {
    setBikeInfrastructFeatures(bicycleInfrastructureData);
    setBikeabilityFeatures(bikeabilityData); // Set bikeability features
    setBISegmentFeatures(biSegmentData);
    setAnonymizedFeatures(anonymizedData);
  }, [bicycleInfrastructureData, bikeabilityData, biSegmentData, anonymizedData]); // Update state when data changes

  return (
    <>
      <MapFeatureContext.Provider value={bikeInfrastructFeaturesValue}>
        <MapContentContext.Provider value={{ mapContent: <></>, setMapContent: () => {} }}>
          {children}
        </MapContentContext.Provider>
      </MapFeatureContext.Provider>
    </>
    );
  }
