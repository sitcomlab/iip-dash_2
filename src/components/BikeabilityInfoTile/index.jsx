import { useContext } from "react";
import { length } from "@turf/length";
import { useState } from "react";

import BaseTile from "@components/BaseTile";
import { DynamicDataBox } from "./DynamicDataBox";
import { MapFeatureContext } from "@components/MapFeatureProvider";
import { ReactECharts } from "../AdminAreaInfoTile/ReactECharts";
import LoadingSpinner from "@/components/Elements/LoadingSpinner";

function Histogram({ data, chartColor }) {
  let buckets = [
    ">0 - 0.2",
    ">0.2 - 0.4",
    ">0.4 - 0.6",
    ">0.6 - 0.8",
    ">0.8 - 1"
  ];
  let segmentBikeability = data.map((currentFeature) => {
    return currentFeature.properties.bikeability_index;
  });
  let bucketDistribution = [0, 0, 0, 0, 0];

  //todo: account for segment length
  for (const segment of data) {
    const bikeability = segment.properties.bikeability_index
    switch(true){
      // greater than 0, because currently no-data segments seem to appear as 0
      // TODO: once backend fix for issue #27 available, consider 0 again
      case bikeability <= 0.2 && bikeability > 0.0:
        bucketDistribution[0] += length(segment, {unit: "kilometers"});
        break;
      case bikeability <= 0.4 && bikeability > 0.2:
        bucketDistribution[1] += length(segment, {unit: "kilometers"});
        break;
      case bikeability <= 0.6 && bikeability > 0.4:
        bucketDistribution[2] += length(segment, {unit: "kilometers"});
        break;
      case bikeability <= 0.8 && bikeability > 0.6:
        bucketDistribution[3] += length(segment, {unit: "kilometers"});
        break
      case bikeability <= 1 && bikeability > 0.8:
        bucketDistribution [4] += length(segment, {unit: "kilometers"});
        break;
      default:
        break;
    }
  }

  return (
    <div className="h-80 mt-10 w-full">
      <p className="text-md font-normal w-full">Verteilung der Bikeability (pro Kilometer)</p>
      <ReactECharts
        option={{
          xAxis: {
            data: buckets,
          },
          yAxis: {
          },
          series: [
            {
              type: "bar",
              data: bucketDistribution,
              itemStyle: {
                color: chartColor,
              },
            },
          ],
        }}
      />
    </div>
  );
}

function BikeabilityInfoTile() {
  const { biSegmentFeatures } =
    useContext(MapFeatureContext);

  if (
    biSegmentFeatures?.features == null //||
    //anonymizedFeatures == null ||
    //anonymizedFeatures.features == null
  ) {
    return <BaseTile height="h-[49rem]">
      <div className="flex justify-center h-full relative">
        <LoadingSpinner className="mt-auto mb-auto" size="9"/>
      </div>
    </BaseTile>;
  }

  // TODO: consider 0 again once backend fix for issue #27 is available
  const inputFeatures = biSegmentFeatures.features.filter((feature) => feature.properties.bikeability_index > 0)

  //calculate total distance cycled
  const totalLength = inputFeatures.reduce(
    (accumulator, currentFeature) => {
      return accumulator + length(currentFeature, { units: "kilometers" });
    },
    0,
  );

  //calculate mean bikeability
  const meanBikeability =
    inputFeatures.reduce((accumulator, currentFeature) => {
      return (
        accumulator +
        currentFeature.properties.bikeability_index *
          length(currentFeature, { units: "kilometers" })
      );
    }, 0) / totalLength;

  return (
    <BaseTile height="row-span-2" width="col-span-1">

      <div className="text-lg font-semibold mt-2 mb-4">
        Bikeability Statistiken <br />
      </div>
      <div className="flex flex-wrap flex-row justify-center w-full gap-2">

        <DynamicDataBox
          value={totalLength}
          decimals={2}
          unit="km"
          header="Abgedecktes Netzwerk"
          size="big"
          color="bg-sky-500"
        ></DynamicDataBox>

        <DynamicDataBox
          value={meanBikeability}
          decimals={2}
          unit=""
          header="Durchschnittliche Bikeability"
          size="big"
          color="bg-sky-500"
        ></DynamicDataBox>

        <Histogram
          data={inputFeatures}
          chartColor="blue"
        />
      </div>
    </BaseTile>
  );
}

//TODO: rename this later
export function BikeabilityInfoTileSmall() {
}

export default BikeabilityInfoTile;
