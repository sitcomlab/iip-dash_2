"use client";
import React, { useContext } from 'react';
import { GeoJSON, FeatureGroup, Pane } from 'react-leaflet';
import { GroupedLayer } from "../LayerControl/LayerControl";
import { addInfo } from "../popupInfos/PopupAddInfo";
import { MapFeatureContext } from "../../MapFeatureProvider";

// Color scales for bikeability classes
const BIKEABILITY_COLORS = [
    { range: [0, 0.20], color: 'rgb(255, 255, 255)' }, // White
    { range: [0.21, 0.40], color: 'rgb(255, 200, 200)' }, // Light red
    { range: [0.41, 0.60], color: 'rgb(255, 150, 150)' }, // Medium red
    { range: [0.61, 0.80], color: 'rgb(255, 100, 100)' }, // Dark red
    { range: [0.81, 1], color: 'rgb(255, 0, 0)' } // Full red
];

const ANONYMIZED_COLORS = [
    { range: [0, 0.20], color: 'rgb(230, 230, 255)' }, // Light blue
    { range: [0.21, 0.40], color: 'rgb(200, 200, 255)' }, // Medium light blue
    { range: [0.41, 0.60], color: 'rgb(150, 150, 255)' }, // Medium blue
    { range: [0.61, 0.80], color: 'rgb(100, 100, 255)' }, // Dark blue
    { range: [0.81, 1], color: 'rgb(0, 0, 255)' } // Full blue
];


const Bikeability = (props) => {
    const { bikeabilityFeatures, biSegmentFeatures, anonymizedFeatures } = useContext(MapFeatureContext);

    // Check if features are defined
    // TODO: this guard clause was previously broken because of using AND instead of OR
    if ((bikeabilityFeatures === undefined || bikeabilityFeatures.features === undefined)
        //(biSegmentFeatures === undefined || biSegmentFeatures.features === undefined) &&
        //(anonymizedFeatures === undefined || anonymizedFeatures.features === undefined)
        ){
        return <></>;
    }

    // Function to determine color based on factor score
    const getColor = (factorScore, isAnonymized = false) => {
        const colorScale = isAnonymized ? ANONYMIZED_COLORS : BIKEABILITY_COLORS;
        const classInfo = colorScale.find(cls =>
            factorScore >= cls.range[0] && factorScore <= cls.range[1]
        );
        return classInfo ? classInfo.color : 'rgb(255, 255, 255)'; // Default to white
    };

    // Style function for GeoJSON lines
    const styleLines = (feature, isAnonymized = false) => {
        return {
            color: getColor(feature.properties.factor_score, isAnonymized),
            weight: 5,
            opacity: 0.7
        };
    };

    return (
        <>
            <GroupedLayer checked group="Bikeability" name="Strecken-Bikeability">
                <Pane name="trackwiseBikeability" style={{ zIndex: 500 }}>
                   <FeatureGroup>
                        <GeoJSON
                            data={bikeabilityFeatures}
                            style={(feature) => styleLines(feature, false)}
                            onEachFeature={addInfo}
                        />
                    </FeatureGroup>
                </Pane>
            </GroupedLayer>
            <GroupedLayer checked group="Bikeability" name="Bikeability">
                <Pane name="bikeability" style={{ zIndex: 500 }}>
                  {/*
                  <FeatureGroup>
                        <GeoJSON
                            data={biSegmentFeatures}
                            style={(feature) => styleLines(feature, false)}
                            onEachFeature={addInfo}
                        />
                    </FeatureGroup>
                  */}
                </Pane>
            </GroupedLayer>
            <GroupedLayer checked={false} group="Anonymisierte Bikeability" name="Anonymized-Bikeability">
                <Pane name="anonymizedBikeability" style={{ zIndex: 501 }}>
                    <FeatureGroup>
                        <GeoJSON
                            data={anonymizedFeatures}
                            style={(feature) => styleLines(feature, true)}
                            onEachFeature={addInfo}
                        />
                    </FeatureGroup>
                </Pane>
            </GroupedLayer>
        </>
    );
};

export default Bikeability;
