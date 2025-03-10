"use client";
import React from 'react';
import { GeoJSON, FeatureGroup, Pane } from 'react-leaflet';
import { GroupedLayer } from "../LayerControl/LayerControl";
import { addInfo } from "../popupInfos/PopupAddInfo";

// Color scale for bikeability classes
const BIKEABILITY_COLORS = [
    { range: [0, 0.25], color: 'rgb(255, 255, 255)' }, // White
    { range: [0.25, 0.55], color: 'rgb(255, 200, 200)' }, // Light red
    { range: [0.55, 0.75], color: 'rgb(255, 150, 150)' }, // Medium red
    { range: [0.75, 0.9], color: 'rgb(255, 100, 100)' }, // Dark red
    { range: [0.9, 1], color: 'rgb(255, 0, 0)' } // Full red
];

const Bikeability = (props) => {
    // Check if contentGeometry is defined
    if (props.contentGeometry === undefined || props.contentGeometry.features === undefined) {
        return <></>;
    }

    const data = props.contentGeometry; // Use data from props

    // Function to determine color based on factor score
    const getColor = (factorScore) => {
        const classInfo = BIKEABILITY_COLORS.find(cls => 
            factorScore >= cls.range[0] && factorScore <= cls.range[1]
        );
        return classInfo ? classInfo.color : 'rgb(255, 255, 255)'; // Default to white
    };

    // Style function for GeoJSON lines
    const styleLines = (feature) => {
        return {
            color: getColor(feature.properties.factor_score), // Use the factor score to determine color
            weight: 5, // Line weight
            opacity: 0.7 // Line opacity
        };
    };

    return (
        <>
            <GroupedLayer checked group="Bikeability" name="Bikeability">
                <Pane name="bikeability" style={{ zIndex: 500 }}>
                    <FeatureGroup>
                        <GeoJSON
                            data={data}
                            style={styleLines}
                            onEachFeature={addInfo}
                        />
                    </FeatureGroup>
                </Pane>
            </GroupedLayer>
            <GroupedLayer checked={false} group="Anonymization " name="Anonymized-Bikeability">
                <Pane name="anonymizedBikeability" style={{ zIndex: 501 }}>
                    <FeatureGroup>
                        <GeoJSON
                            data={data} // Use the same or different data as needed
                            style={styleLines}
                            onEachFeature={addInfo}
                        />
                    </FeatureGroup>
                </Pane>
            </GroupedLayer>
        </>
    );
};

export default Bikeability;
