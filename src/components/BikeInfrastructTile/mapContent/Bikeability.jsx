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

const BISEGMENT_DARKER_COLORS = [
    { range: [0, 0.20], color: 'rgb(200, 200, 200)' }, // Light gray
    { range: [0.21, 0.40], color: 'rgb(255, 100, 100)' }, // Darker light red
    { range: [0.41, 60], color: 'rgb(255, 0, 0)' }, // Darker medium red
    { range: [0.61, 0.80], color: 'rgb(120, 0, 0)' }, // Darker dark red
    { range: [0.81, 1], color: 'rgb(90, 0, 0)' } // Darkest red
];


const Bikeability = (props) => {
    const { bikeabilityFeatures, biSegmentFeatures, anonymizedFeatures } = useContext(MapFeatureContext);

    // Check if features are defined
    // TODO: this guard clause was previously broken because of using AND instead of OR
    if ((bikeabilityFeatures == undefined || bikeabilityFeatures.features == undefined) &&
        (biSegmentFeatures == undefined || biSegmentFeatures.features == undefined) &&
        (anonymizedFeatures == undefined || anonymizedFeatures.features == undefined)
        ){
        return <></>;
    }
    // console.log('biSegmentFeatures:', bikeabilityFeatures);
    console.log('biSegmentFeatures:', biSegmentFeatures);
    // if (biSegmentFeatures && biSegmentFeatures.features) {
    //     biSegmentFeatures.features.forEach(feature => {
    //         console.log('bikeability_index:', feature.properties.bikeability_index);
    //     });
    // }
    // Function to determine color based on factor score
    const getColor = (factorScore, isAnonymized = false) => {
        const colorScale = isAnonymized ? ANONYMIZED_COLORS : BIKEABILITY_COLORS;
        const classInfo = colorScale.find(cls =>
            factorScore >= cls.range[0] && factorScore <= cls.range[1]
        );
        return classInfo ? classInfo.color : 'rgb(255, 255, 255)'; // Default to white
    };

    // Style function for GeoJSON lines, handling all three feature types
    const styleLines = (feature, isAnonymized = false) => {
        let score;
        let colorScale = BIKEABILITY_COLORS;
        if (isAnonymized) {
            score = feature.properties.factor_score;
            colorScale = ANONYMIZED_COLORS;
        } else if (feature.properties.bikeability_index !== undefined) {
            score = feature.properties.bikeability_index;
            colorScale = BISEGMENT_DARKER_COLORS;
        } else {
            score = feature.properties.factor_score;
            colorScale = BIKEABILITY_COLORS;
        }
        // Assign distinct color for null or undefined scores
        if (score === null || score === undefined) {
            score = -1; // Will not match any range, so default color white will be used
        }
        const classInfo = colorScale.find(cls =>
            score >= cls.range[0] && score <= cls.range[1]
        );
        return {
            color: classInfo ? classInfo.color : 'rgb(255, 255, 255)',
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
            <GroupedLayer checked={false} group="OSM Bikeability" name="OSM-Bikeability">
                <Pane name="segementwisebikeability" style={{ zIndex: 501 }}>
                    <FeatureGroup>
                        {biSegmentFeatures && (
                            <GeoJSON
                                data={biSegmentFeatures}
                                style={(feature) => styleLines(feature, false)}
                                onEachFeature={addInfo}
                                // ref={(geojsonLayer) => {
                                //     if (geojsonLayer && geojsonLayer.leafletElement) {
                                //         const bounds = geojsonLayer.leafletElement.getBounds();
                                //         console.log('biSegmentFeatures bounds:', bounds);
                                //     }
                                // }}
                            />
                        )}
                    </FeatureGroup>
                </Pane>
            </GroupedLayer>
            <GroupedLayer checked={false} group="Anonymisierte Bikeability" name="Anonymized-Bikeability">
                <Pane name="anonymizedBikeability" style={{ zIndex: 502 }}>
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
