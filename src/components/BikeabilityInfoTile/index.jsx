import { useContext } from "react";
import { length } from "@turf/length";

import BaseTile from "@components/BaseTile";
import { DynamicDataBox } from "./DynamicDataBox";
import { MapFeatureContext } from "@components/MapFeatureProvider";
import { ReactECharts } from "../AdminAreaInfoTile/ReactECharts";

function BarChartMonths({ data }) {
  let months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  let trajectoryMonths = data.features.map((currentFeature) => {
    return currentFeature.properties.month;
  });
  let monthDistribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const month of trajectoryMonths) {
    let i = month - 1;
    monthDistribution[i] += 1;
  }

  let shortMonthDistr = [];
  let shortMonths = [];
  for (const i in monthDistribution) {
    if (monthDistribution[i] != 0) {
      shortMonthDistr.push(monthDistribution[i]);
      shortMonths.push(months[i]);
    }
  }

  return (
    <div className="h-80 mt-10 w-full">
      <p className="text-sm font-normal w-full">Verteilung der Messungen</p>
      <ReactECharts
        option={{
          xAxis: {
            data: shortMonths,
          },
          yAxis: {},
          series: [
            {
              type: "bar",
              data: shortMonthDistr,
            },
          ],
        }}
      />
    </div>
  );
}

function BikeabilityInfoTile() {
  const { bikeabilityFeatures, anonymizedFeatures } =
    useContext(MapFeatureContext);

  if (
    bikeabilityFeatures === undefined ||
    bikeabilityFeatures.features === undefined ||
    anonymizedFeatures === undefined ||
    anonymizedFeatures.features === undefined
  ) {
    return <BaseTile height="h-[49rem]"></BaseTile>;
  }

  //calculate total distance cycled
  const totalLength = bikeabilityFeatures.features.reduce(
    (accumulator, currentFeature) => {
      return accumulator + length(currentFeature, { units: "kilometers" });
    },
    0,
  );

  //calculate mean bikeability
  // TODO: adjust based on how bikeability for each route is calculated
  // if trajectory length is not considered in the bikeability of one, lose the distance factor
  const meanBikeability =
    bikeabilityFeatures.features.reduce((accumulator, currentFeature) => {
      return (
        accumulator +
        currentFeature.properties.factor_score *
          length(currentFeature, { units: "kilometers" })
      );
    }, 0) / totalLength;

  //count amount of trajectories
  const trajectoryAmount = bikeabilityFeatures.features.length;

  return (
    <BaseTile height="h-[49rem]">
      <p className="text-md font-semibold w-full mb-4">
        Bikeability <br />
        <span className="font-normal">nicht-anonymisierte Sensordaten</span>
      </p>
      <div className="flex flex-wrap flex-row justify-center w-full gap-2">
        <DynamicDataBox
          value={totalLength}
          decimals={2}
          unit="km"
          header="Distanz geradelt"
          size="big"
        ></DynamicDataBox>
        <DynamicDataBox
          value={meanBikeability}
          decimals={2}
          unit=""
          header="Bikeability durchschnitt"
          size="big"
        ></DynamicDataBox>
        <DynamicDataBox
          value={trajectoryAmount}
          decimals={0}
          unit=""
          header="Strecken gefahren"
          size="big"
        ></DynamicDataBox>
        <BarChartMonths data={bikeabilityFeatures} />
      </div>
    </BaseTile>
  );
}

export default BikeabilityInfoTile;
