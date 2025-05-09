"use client";
import { FeatureGroup, GeoJSON, Pane, Popup, Tooltip } from "react-leaflet";
import { useContext } from "react";
import styled from "styled-components";
import { renderToStaticMarkup } from "react-dom/server";
import { useRecoilState } from "recoil";
import { MarkerClusterGroup } from "leaflet";

import { GroupedLayer } from "../LayerControl/LayerControl";
import BiMarkerIcon from "./BiMarkerIcon";
import { addInfo } from "../popupInfos/PopupAddInfo";
import { SvgTrainstationIcon as TrainstationIcon } from "@/components/Icons/TrainstationIcon";
import { SvgBusStopIcon as BusStopIcon } from "@/components/Icons/BusStopIcon";
import { SvgParkingIcon as ParkingIcon } from "@/components/Icons/ParkingIcon";
import { SvgShopIcon as ShopIcon } from "@/components/Icons/ShopIcon";
import { SvgRepairIcon as RepairIcon } from "@/components/Icons/RepairIcon";
import { SvgRentalIcon as RentalIcon } from "@/components/Icons/RentalIcon";
import { SvgTubeIcon as TubeIcon } from "@/components/Icons/TubeIcon";

import {
  selectedAAState,
  selectedAAFeatureState,
  displayedPointDataState,
} from "@/components/RecoilContextProvider";
import { MapContentContext } from "@/components/MapFeatureProvider";

//TODO: managing the tiles for AA-info
//TODO: LayerControl doesn't yet properly update the layers as displayed on map

const StyledPopup = styled(Popup)`
  min-width: 400px;
  padding: 0rem;
  margin: 0rem;
  border: 0rem;
`;

const PointDataType = {
  none: "keine",

  öffis: "Öffis",

  service: "Service",

  fahrradLaden: "Fahrrad-Laden",
  diyStation: "DIY-Station",
  radVerleih: "Rad-Verleih",
  schlauchAutomat: "Schlauch-Automat",

  parken: "Parken",
  ladeStation: "Ladestation",

  fahrradAmpel: "Fahrrad-Ampel",
};

function AdministrativeAreas(props) {
  const { mapContent, setMapContent } = useContext(MapContentContext);
  const [selectedAA, setSelectedAA] = useRecoilState(selectedAAState);
  const [selectedAAFeature, setSelectedAAFeature] = useRecoilState(
    selectedAAFeatureState,
  );
  const [displayedPointData, setDisplayedPointData] = useRecoilState(
    displayedPointDataState,
  );

  //guard clause to ensure no crashes when data not loaded yet
  if (
    props.contentGeometry === undefined ||
    props.contentGeometry.features === undefined
  ) {
    return <></>;
  }

  //TODO: selection methods

  function isAdminAreaSelected(adminArea) {
    if (
      selectedAAFeature === undefined ||
      selectedAAFeature.properties === undefined
    ) {
      return false;
    }
    return selectedAAFeature.properties.name == adminArea;
  }

  function arePointDataDisplayed(adminArea, typeDisplay) {
    if (
      selectedAAFeature === undefined ||
      selectedAAFeature.properties === undefined
    ) {
      return false;
    }
    return (
      selectedAAFeature.properties.name == adminArea &&
      displayedPointData == typeDisplay
    );
  }

  // ## ADMINISTRATIVE AREAS
  //filter and style administrative areas
  const administrativeAreas = props.contentGeometry.features.filter(
    (feature) => feature.properties.bike_infrastructure_type === "admin_area",
  );
  const adminAreaOptions = {
    color: "#000000",
    weight: 2,
    opacity: 1,
    fillColor: "#4d514d",
    fillOpacity: 0.2,
  };
  const selectedAdminAreaOptions = {
    color: "#000000",
    weight: 2,
    opacity: 1,
    fillColor: "#4d514d",
    fillOpacity: 0,
  };
  //event functions for Adnimistrative areas
  function clickAdminArea(e, feature) {
    setSelectedAA(feature.properties.name);
    setSelectedAAFeature(feature);
    e.target.setStyle({
      color: "#000000",
      weight: 2,
      opacity: 1,
      fillColor: "#4d514d",
      fillOpacity: 0,
    });
    if (e.target.isTooltipOpen()) {
      e.target.closeTooltip();
    }
  }
  function popupCloseAdminArea(e) {
    e.target.setStyle({
      color: "#000000",
      weight: 2,
      opacity: 1,
      fillColor: "#4d514d",
      fillOpacity: 0.2,
    });
  }
  function mouseMoveAdminArea(e) {
    if (!e.target.isPopupOpen()) {
      e.target.openTooltip(e.latlng);
    }
  }
  function mouseOverAdminArea(e) {
    if (e.target.isPopupOpen()) {
      e.target.closeTooltip();
    }
  }

  //filter Bus and train stations of selected admin area
  const trainStations = props.contentGeometry.features.filter(
    (feature) =>
      feature.properties.bike_infrastructure_type === "train_station" &&
      feature.properties.aa === selectedAA &&
      PointDataType.öffis === displayedPointData,
  );
  function pointTrain(geojsonPoint, latlng) {
    const trainIcon = L.divIcon({
      className: "",
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#FF0000"
          icon={<TrainstationIcon fill="#FFF3F3" />}
        ></BiMarkerIcon>,
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [-3, -11],
    });
    return L.marker(latlng, { icon: trainIcon });
  }
  // Filter and style bus stops
  //TODO: merge bus stops at the same street
  const busStops = props.contentGeometry.features.filter(
    (feature) =>
      feature.properties.bike_infrastructure_type === "bus_stop" &&
      feature.properties.aa === selectedAA &&
      false,
  );
  function pointBusStop(geojsonPoint, latlng) {
    //TODO: add bus icon
    //TODO: implement popup for departures
    const trainIcon = L.divIcon({
      className: "",
      html: renderToStaticMarkup(<BusStopIcon height="70%" width="70%" />),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [-3, -11],
    });
    return L.marker(latlng, { icon: trainIcon });
  }
  // Filter and style parking
  const parking = props.contentGeometry.features.filter(
    (feature) =>
      feature.properties.bike_infrastructure_type === "parking" &&
      feature.geometry.type === "Point" &&
      feature.properties.aa === selectedAA &&
      displayedPointData == PointDataType.parken,
  );
  function pointParking(geojsonPoint, latlng) {
    const parkingIcon = L.divIcon({
      className: "",
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#203864"
          icon={<ParkingIcon fill="#DEEBF7" />}
        ></BiMarkerIcon>,
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [-3, -11],
    });
    return L.marker(latlng, { icon: parkingIcon });
  }
  // Filter and Style service stations
  const bicycleShops = props.contentGeometry.features.filter(
    (feature) =>
      feature.properties.bike_infrastructure_type === "bicycle_shop" &&
      feature.geometry.type === "Point" &&
      feature.properties.aa === selectedAA &&
      displayedPointData == PointDataType.service,
  );
  function pointShop(geojsonPoint, latlng) {
    const shopIcon = L.divIcon({
      className: "",
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#385723"
          icon={<ShopIcon fill="#E2F0D9" />}
        ></BiMarkerIcon>,
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [-3, -11],
    });
    return L.marker(latlng, { icon: shopIcon });
  }
  const tubeVendings = props.contentGeometry.features.filter(
    (feature) =>
      feature.properties.bike_infrastructure_type === "tube_vending_machine" &&
      feature.properties.aa === selectedAA &&
      displayedPointData == PointDataType.service,
  );
  function pointTube(geojsonPoint, latlng) {
    const tubeIcon = L.divIcon({
      className: "",
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#385723"
          icon={<TubeIcon fill="#E2F0D9" />}
        ></BiMarkerIcon>,
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [-3, -11],
    });
    return L.marker(latlng, { icon: tubeIcon });
  }
  const repairStations = props.contentGeometry.features.filter(
    (feature) =>
      feature.properties.bike_infrastructure_type ===
        "bicycle_repair_station" &&
      feature.properties.aa === selectedAA &&
      displayedPointData == PointDataType.service,
  );
  function pointRepair(geojsonPoint, latlng) {
    const repairIcon = L.divIcon({
      className: "",
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#385723"
          icon={<RepairIcon fill="#E2F0D9" />}
        ></BiMarkerIcon>,
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [-3, -11],
    });
    return L.marker(latlng, { icon: repairIcon });
  }
  const rentals = props.contentGeometry.features.filter(
    (feature) =>
      feature.properties.bike_infrastructure_type === "bicycle_rental" &&
      feature.properties.aa === selectedAA &&
      displayedPointData == PointDataType.service,
  );
  function pointRental(geojsonPoint, latlng) {
    const rentalIcon = L.divIcon({
      className: "",
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#385723"
          icon={<RentalIcon fill="#E2F0D9" />}
        ></BiMarkerIcon>,
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [-3, -11],
    });
    return L.marker(latlng, { icon: rentalIcon });
  }

  return (
    <>
      {displayedPointData == PointDataType.parken && (
        <GroupedLayer
          checked
          group="Parken + Laden"
          icon={<ParkingIcon />}
          name="Parken"
        >
          <Pane name="parking" style={{ zIndex: 610 }}>
            <MarkerClusterGroup
              clusterPane={"parking"}
              eventHandlers={{
                //TODO: look up how this works
                //TODO: what does this even do?
                //TODO: implement in a way that works
                add: (e) => {
                  //dispatch(updateParkingOverlay(true));
                },
                remove: (e) => {
                  //dispatch(updateParkingOverlay(false));
                },
              }}
              iconCreateFunction={createClusterCustomIconBlue}
              polygonOptions={{
                color: "#1c2b46",
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.3,
              }}
              spiderfyDistanceMultiplier={3}
            >
              <GeoJSON
                data={parking}
                key={"parking_" + selectedAA}
                onEachFeature={addInfo}
                pointToLayer={pointParking}
              />
            </MarkerClusterGroup>
          </Pane>
        </GroupedLayer>
      )}
      {displayedPointData == PointDataType.service && (
        <>
          <GroupedLayer
            checked
            group="Rad-Service"
            icon={<ShopIcon />}
            name="Fahrrad-Laden"
          >
            <Pane name="bicycleShops" style={{ zIndex: 514 }}>
              <MarkerClusterGroup
                clusterPane={"bicycleShops"}
                iconCreateFunction={createClusterCustomIconGreen}
                polygonOptions={{
                  color: "#253a18",
                  weight: 2,
                  opacity: 0.8,
                  fillOpacity: 0.3,
                }}
                spiderfyDistanceMultiplier={3}
              >
                <GeoJSON
                  data={bicycleShops}
                  key={"bicycleShops" + selectedAA}
                  onEachFeature={addInfo}
                  pointToLayer={pointShop}
                ></GeoJSON>
              </MarkerClusterGroup>
            </Pane>
          </GroupedLayer>

          <GroupedLayer
            checked
            group="Rad-Service"
            icon={<RepairIcon fill="#000000" />}
            name="DIY-Station"
          >
            <Pane name="repairStations" style={{ zIndex: 513 }}>
              <FeatureGroup>
                <GeoJSON
                  data={repairStations}
                  key={"repairStations" + selectedAA}
                  onEachFeature={addInfo}
                  pointToLayer={pointRepair}
                />
              </FeatureGroup>
            </Pane>
          </GroupedLayer>

          <GroupedLayer checked group="Rad-Service" name="Rad-Verleih">
            <Pane name="rentals" style={{ zIndex: 512 }}>
              <FeatureGroup>
                <GeoJSON
                  data={rentals}
                  key={"rentals" + selectedAA}
                  onEachFeature={addInfo}
                  pointToLayer={pointRental}
                />
              </FeatureGroup>
            </Pane>
          </GroupedLayer>

          <GroupedLayer checked group="Rad-Service" name="Schlauch-Automat">
            <Pane name="tubeVendings" style={{ zIndex: 511 }}>
              <FeatureGroup>
                <GeoJSON
                  data={tubeVendings}
                  key={"tubeVendings" + selectedAA}
                  onEachFeature={addInfo}
                  pointToLayer={pointTube}
                />
              </FeatureGroup>
            </Pane>
          </GroupedLayer>
        </>
      )}

      {mapContent}

      <GroupedLayer checked group="Stadtteile" name="Stadtteile">
        <Pane name="administrativeAreas" style={{ zIndex: 500 }}>
          <FeatureGroup>
            {administrativeAreas.map((feature, index) => {
              if (isAdminAreaSelected(feature.properties.name)) {
                return (
                  <GeoJSON
                    data={feature}
                    key={"aa" + index + Date.now() + "selected"}
                    pathOptions={selectedAdminAreaOptions}
                  ></GeoJSON>
                );
              }

              return (
                <GeoJSON
                  data={feature}
                  eventHandlers={{
                    click: (e) => {
                      clickAdminArea(e, feature);
                    },
                    mousemove: mouseMoveAdminArea,
                    mouseover: mouseOverAdminArea,
                  }}
                  key={"aa" + index + Date.now()}
                  pathOptions={adminAreaOptions}
                >
                  <Tooltip pane="tooltip">{feature.properties.name}</Tooltip>
                </GeoJSON>
              );
            })}
          </FeatureGroup>
        </Pane>
      </GroupedLayer>
    </>
  );
}

export default AdministrativeAreas;
