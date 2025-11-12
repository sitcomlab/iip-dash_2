"use client";
import React, { useContext, useRef, useCallback, useEffect } from 'react';
import { GeoJSON, FeatureGroup, Pane, useMap} from 'react-leaflet';
import { GroupedLayer } from "../LayerControl/LayerControl";
import { addInfo } from "../popupInfos/PopupAddInfo";
import { MapFeatureContext } from "../../MapFeatureProvider";
import { mapLoadingState } from '@/components/RecoilContextProvider';
import { useRecoilState } from 'recoil';
import md5 from "md5";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import dynamic from "next/dynamic";

const RoutingMachine = dynamic(() => import("./RoutingMachine"), { ssr: false });

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
    { range: [0.21, 0.40], color: 'rgb(200, 200, 255)' }, // Medium light blue)
    { range: [0.41, 0.60], color: 'rgb(150, 150, 255)' }, // Medium blue
    { range: [0.61, 0.80], color: 'rgb(100, 100, 255)' }, // Dark blue
    { range: [0.81, 1], color: 'rgb(0, 0, 255)' } // Full blue
];

const BISEGMENT_DARKER_COLORS = [
    { range: [0, 0.20], color: 'rgb(255, 0, 0)' },      // Bright red
    { range: [0.21, 0.40], color: 'rgb(255, 102, 0)' }, // Bright orange
    { range: [0.41, 0.60], color: 'rgb(255, 255, 0)' }, // Bright yellow
    { range: [0.61, 0.80], color: 'rgb(0, 204, 0)' },   // Bright green
    { range: [0.81, 1], color: 'rgb(0, 102, 255)' }     // Bright blue
];

// // Test
// const RoutingMachine = () => {
//   const map = useMap();
//   const routingRef = useRef(null);

//   useEffect(() => {
//     if (!map) return;

//     const myIcon = L.icon({
//       iconUrl: '/icons/marker-icon.png', 
//       iconSize: [25, 41], 
//       iconAnchor: [12, 41], 
//       popupAnchor: [1, -34], 
//     });

//     const routingControl = L.Routing.control({
//       waypoints: [
//         L.latLng(51.9625, 7.6256), // Münster center
//         L.latLng(51.9554, 7.6528), // Münster Zoo area
//       ],
//       routeWhileDragging: true,
//       showAlternatives: true,
//       addWaypoints: true,
//       geocoder: L.Control.Geocoder.nominatim(),
//       position:"topleft",
//       createMarker: (i, waypoint, n) => {
//         return L.marker(waypoint.latLng, { icon: myIcon, draggable: true });
//       }
//     }).addTo(map);
//     routingRef.current = routingControl;

//     return () => {
//       if (routingRef.current) {
//         map.removeControl(routingRef.current);
//         routingRef.current = null;
//       }
//     };
//   }, [map]);

//   return null;
// };

const Bikeability = (props) => {
    const { bikeabilityFeatures, biSegmentFeatures, anonymizedFeatures } = useContext(MapFeatureContext);
    const [mapLoading, setMapLoading] = useRecoilState(mapLoadingState)

    const segmentRef = useRef(null);

    // Style function for GeoJSON lines, handling all three feature types
    const styleLines = useCallback((feature, isAnonymized = false) => {
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
    }, []);

    // Only set loading when GeoJSON layer is added
    useEffect(() => {
        if (!biSegmentFeatures?.features) {
            setMapLoading(true);
            return;
            }
            // console.time("Leaflet-add-layer");
            
            const layer = segmentRef.current;
            if (layer?._layers) {
            // wait until Leaflet actually adds features
            const checkLoaded = setInterval(() => {
                const keys = Object.keys(layer._layers || {});
                if (keys.length > 0) {
                    // console.timeEnd("Leaflet-add-layer");
                    setMapLoading(false);
                    clearInterval(checkLoaded);
                    }
                }, 50);
                return () => clearInterval(checkLoaded);
            }
        }, [biSegmentFeatures,setMapLoading]);

    if (!bikeabilityFeatures?.features && !biSegmentFeatures?.features && !anonymizedFeatures?.features) {
        setMapLoading(true);
        return null;
    }

    return (
        <>
            { false &&
            <GroupedLayer checked group="Bikeability" name="Strecken-Bikeability">
                <Pane name="trackwiseBikeability" style={{ zIndex: 500 }}>
                    <FeatureGroup>
                        {bikeabilityFeatures && (
                            <GeoJSON
                                data={bikeabilityFeatures}
                                style={(feature) => styleLines(feature, false)}
                                onEachFeature={addInfo}
                                key={"BITracks_" + md5(JSON.stringify(bikeabilityFeatures))}
                            />
                        )}
                    </FeatureGroup>
                </Pane>
            </GroupedLayer>
            }
            <GroupedLayer checked={true} group="OSM Bikeability" name="OSM-Bikeability">
                <Pane name="segementwisebikeability" style={{ zIndex: 501 }}>
                    <FeatureGroup>
                        {biSegmentFeatures && (
                            <GeoJSON
                                data={biSegmentFeatures}
                                style={(feature) => styleLines(feature, false)}
                                onEachFeature={addInfo}
                                key={"BISegments_" + md5(JSON.stringify(biSegmentFeatures))}
                                ref={segmentRef}
                                renderer={L.canvas()} 
                                // key="BISegments_static"
                            />
                        )
                        }
                    </FeatureGroup>
                </Pane>
            </GroupedLayer>
            <RoutingMachine />
        {false &&
          <GroupedLayer checked={false} group="Anonymisierte Bikeability" name="Anonymized-Bikeability">
            <Pane name="anonymizedBikeability" style={{ zIndex: 502 }}>
              <FeatureGroup>
                {anonymizedFeatures && (
                  <GeoJSON
                    data={anonymizedFeatures}
                    style={(feature) => styleLines(feature, true)}
                    onEachFeature={addInfo}
                    key={"BIAnon_" + md5(JSON.stringify(anonymizedFeatures))}
                  />
                )}
              </FeatureGroup>
            </Pane>
          </GroupedLayer>
        }
        </>
    );
};

export default Bikeability;


