import { useContext } from "react";
import { length } from "@turf/length";
import { useState } from "react";

import BaseTile from "@components/BaseTile";
import { DynamicDataBox } from "./DynamicDataBox";
import { MapFeatureContext } from "@components/MapFeatureProvider";
import { BarChart, Bar, ResponsiveContainer, YAxis, XAxis, Label, Cell } from 'recharts';
import LoadingSpinner from "@/components/Elements/LoadingSpinner";

function Histogram({ data, chartColor }) {
  let buckets = [
    ">0 to 0.2",
    ">0.2 to 0.4",
    ">0.4 to 0.6",
    ">0.6 to 0.8",
    ">0.8 to 1"
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

  // prepare dataset for Recharts
  const bars = [
    {
      name: buckets[0],
      bikeability: bucketDistribution[0]
    },
    {
      name: buckets[1],
      bikeability: bucketDistribution[1]
    },
    {
      name: buckets[2],
      bikeability: bucketDistribution[2]
    },
    {
      name: buckets[3],
      bikeability: bucketDistribution[3]
    },
    {
      name: buckets[4],
      bikeability: bucketDistribution[4]
    },
  ]

  const XAxisTick = ({ x, y, stroke, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
          <text x={-10} y={5} dy={20} textAnchor="start" fill="#666" transform="rotate(60)">
            {payload.value}
          </text>
        </g>
      );
  };

  const colors = ["rgb(255, 0, 0)","rgb(255, 102, 0)","rgb(255, 255, 0)","rgb(0, 204, 0)","rgb(0, 102, 255)"]

  return (
    <div className="h-80 mt-5 w-full">
      <p className="text-md font-normal w-full">Verteilung der Bikeability (pro Kilometer)</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={150}
          height={40}
          margin={{
            top: 5,
            right: -10,
            left: 0,
            bottom: 60,
            }}
          data={bars}>
          <XAxis dataKey="name" angle={90} tick={XAxisTick}/>
            <YAxis>
              <Label
              value="Kilometer"
              position="insideLeft"
              angle={90}
              offset={15}
              />
            </YAxis>
          <Bar dataKey="bikeability" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
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
