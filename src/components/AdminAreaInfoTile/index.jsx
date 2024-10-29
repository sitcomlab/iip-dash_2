import { useRecoilState } from "recoil";
import { useState, useEffect, Suspense } from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";

import BaseTile from "@/components/BaseTile";
import { ChartHeadingWrapper, CapacityLegend } from "./styles";
import { CapacitySlider } from "./CapacitySlider";
import AAInfoPages from "./AAInfoPages";
import { DataBoxBig, DataBox } from "./DataBox";
import SliderCarousel from "./ParkingSlideCarousel";
import DonutChart from "./DonutChart";
import PlusTile from "../PlusTileMockup";

import {
  selectedAAState,
  selectedAAFeatureState,
  displayedPointDataState,
} from "@/components/RecoilContextProvider";

export const TilesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 100%;
  align-items: center;
`;

function AdminAreaInfoContent(props) {
  if (props.feature.properties?.name === undefined) {
    return <></>;
  }

  return (
    <AAInfoPages
      name={props.adminArea}
      contentCycling={
        <TilesWrapper>
          <Suspense fallback={<Skeleton height="100%" width="100%" />}>
            <DataBoxBig
              decimals={2}
              header="Gesamtlänge"
              unit="Kilometer"
              value={props.feature.properties.cycling.cyclingstreets.lengthKM}
            ></DataBoxBig>
          </Suspense>
        </TilesWrapper>
      }
      contentService={
        <TilesWrapper>
          <Suspense fallback={<Skeleton height="100%" width="100%" />}>
            <DataBox
              decimals={0}
              header="Läden innerhalb"
              unit=""
              value={props.feature.properties.service.shopsWithin}
            ></DataBox>
          </Suspense>
          <Suspense fallback={<Skeleton height="100%" width="100%" />}>
            <DataBox
              decimals={0}
              header="Läden in der Nähe"
              unit=""
              value={props.feature.properties.service.shopsNearby}
            ></DataBox>
          </Suspense>
          <Suspense fallback={<Skeleton height="100%" width="100%" />}>
            <DataBox
              decimals={2}
              header="Abdeckung"
              unit="%"
              value={props.feature.properties.service.coverage}
            ></DataBox>
          </Suspense>
        </TilesWrapper>
      }
      contentParking={
        <>
          <Suspense fallback={<Skeleton height="90%" width="100%" />}>
            {props.feature.properties.parking.freqObjects > 0 && (
              <SliderCarousel
                contentCapacity={
                  <>
                    <ChartHeadingWrapper>
                      <span className="is-size-6">{"Stellplätze"}</span>
                    </ChartHeadingWrapper>
                    <CapacityLegend>
                      <p className="green">
                        Parkeinheiten mit bekannter <br /> Kapazität
                      </p>
                      <p className="blue">
                        Bekannte Summe an
                        <br /> Stellplätzen
                      </p>
                      <p className="red">
                        Parkeinheiten <br /> mit unbekannter Kapazität
                      </p>
                    </CapacityLegend>
                    <CapacitySlider
                      freqKnown={
                        props.feature.properties.parking.capacity.freqKnown
                      }
                      freqUnknown={
                        props.feature.properties.parking.capacity.freqUnknown
                      }
                      max={
                        props.feature.properties.parking.capacity.freqKnown +
                        props.feature.properties.parking.capacity.freqUnknown
                      }
                      sumStands={
                        props.feature.properties.parking.capacity.sumStands
                      }
                    ></CapacitySlider>
                  </>
                }
                contentParkingunits={
                  <>
                    <div>
                      <DataBoxBig
                        decimals={0}
                        header="Summe Parkeinheiten"
                        value={props.feature.properties.parking.freqObjects}
                      ></DataBoxBig>
                    </div>
                  </>
                }
                contentTypes={
                  <span>
                    <div style={{ height: "240px", width: "400px" }}>
                      <ChartHeadingWrapper>
                        <span className="is-size-6">{"Parktypen"}</span>
                      </ChartHeadingWrapper>
                      <DonutChart
                        data={(() => {
                          function colorPicker(type) {
                            switch (type) {
                              case "Unbekannt":
                                return "#bcbcbc";
                              case "Radstall":
                                return "#f8cc1b";
                              case "Anlehnbügel":
                                return "#fa7a48";
                              case "(Boden)Anker":
                                return "#ab0a58";
                              case "Radboxen":
                                return "#bed057";
                              case "Reifenständer":
                                return "#84a2cd";
                              case "Rad-Gebäude":
                                return "#442276";
                              case "Lenkerhalter":
                                return "#ffa5c8";
                              case "Doppeletage":
                                return "#4777cd";
                            }
                          }

                          const dataArray = [];
                          for (const key of Object.keys(
                            props.feature.properties.parking.type,
                          )) {
                            dataArray.push({
                              value: props.feature.properties.parking.type[key],
                              name: key,
                              color: colorPicker(key),
                            });
                          }
                          return dataArray;
                        })()}
                        orientation="horizontal"
                        style={{ height: "300px" }}
                      />
                    </div>
                  </span>
                }
                contentWeather={
                  <span>
                    <div style={{ height: "240px", width: "350px" }}>
                      <ChartHeadingWrapper>
                        <span className="is-size-6">{"Wetterschutz"}</span>
                      </ChartHeadingWrapper>
                      <DonutChart
                        data={[
                          {
                            value: props.feature.properties.parking.weather.Ja,
                            name: "Ja",
                            color: "rgb(134, 188, 37)",
                          },
                          {
                            value:
                              props.feature.properties.parking.weather.Nein,
                            name: "Nein",
                            color: "rgb(234, 79, 61)",
                          },
                          {
                            value:
                              props.feature.properties.parking.weather
                                .Unbekannt,
                            name: "Unbekannt",
                            color: "#bcbcbc",
                          },
                        ]}
                        orientation="vertical"
                      />
                    </div>
                  </span>
                }
              ></SliderCarousel>
            )}
          </Suspense>
        </>
      }
      contentPublicTransport={
        <TilesWrapper>
          <Suspense fallback={<Skeleton height="100%" width="100%" />}>
            <DataBox
              decimals={0}
              header="Bus- haltestellen"
              unit=""
              value={props.feature.properties.service.busStopsWithin}
            ></DataBox>
          </Suspense>
          <br />
          <Suspense fallback={<Skeleton height="100%" width="100%" />}>
            <DataBox
              decimals={0}
              header="Bahnhöfe"
              unit=""
              value={props.feature.properties.service.trainStationsWithin}
            ></DataBox>
          </Suspense>
        </TilesWrapper>
      }
    ></AAInfoPages>
  );
}

function AdminAreaInfoTile() {
  const [pinned, setPinned] = useState(false);

  const [selectedAA, setSelectedAA] = useRecoilState(selectedAAState);
  const [selectedAAFeature, setSelectedAAFeature] = useRecoilState(
    selectedAAFeatureState,
  );
  const [displayedPointData, setDisplayedPointData] = useRecoilState(
    displayedPointDataState,
  );

  const [selectedAA_pinned, setSelectedAA_pinned] = useState(false);
  const [selectedAAFeature_pinned, setSelectedAAFeature_pinned] =
    useState(false);

  const feature = selectedAAFeature;

  //when invoked, the displayed information will be pinned
  function pin() {
    setSelectedAA_pinned(selectedAA);
    setSelectedAAFeature_pinned(selectedAAFeature);
    setPinned(true);
    console.log(pinned);
  }

  //TODO: figure out how to implement a remove-button for this component
  function remove() {}
  console.log(selectedAA);
  if (selectedAA == "") {
    return <></>;
  }

  return (
    <BaseTile>
      {!pinned && (
        <>
          <button onClick={pin}>pin</button>
          <AdminAreaInfoContent
            adminArea={selectedAA}
            feature={selectedAAFeature}
          />
        </>
      )}

      {pinned && (
        <>
          <AdminAreaInfoContent
            adminArea={selectedAA_pinned}
            feature={selectedAAFeature_pinned}
          />
        </>
      )}
    </BaseTile>
  );
}

export default AdminAreaInfoTile;
