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
import useBiSegmentData from "@/hooks/useBiSegmentData";
import { biWeightsState } from "@/components/RecoilContextProvider";
import { useRecoilValue } from 'recoil';

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
  const weights = useRecoilValue(biWeightsState);

  const bicycleInfrastructureData = useBikeInfrastructData(props.city.infrastructureSource);
  const bikeabilityData = useBikeabilityData(props.city.bikeabilitySource);
  const biSegmentData = useBiSegmentData(props.city.biSegmentSource, weights);
  const anonymizedData = useBikeabilityData(props.city.anonymizationSource);

  const [bikeInfrastructFeatures, setBikeInfrastructFeatures] = useState(null);
  const [bikeabilityFeatures, setBikeabilityFeatures] = useState(null);
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
    setAnonymizedFeatures,
  };

  useEffect(() => {
    setBikeInfrastructFeatures(bicycleInfrastructureData);
    setBikeabilityFeatures(bikeabilityData);
    setBISegmentFeatures(biSegmentData);
    setAnonymizedFeatures(anonymizedData);
  }, [bicycleInfrastructureData, bikeabilityData, biSegmentData, anonymizedData]);

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
