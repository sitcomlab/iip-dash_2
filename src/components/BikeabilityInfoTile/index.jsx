import { useContext } from "react";
import { length } from "@turf/length";
import { useState } from "react";

import BaseTile from "@components/BaseTile";
import { DynamicDataBox } from "./DynamicDataBox";
import { MapFeatureContext } from "@components/MapFeatureProvider";
import { ReactECharts } from "../AdminAreaInfoTile/ReactECharts";

function BarChartMonths({ data, chartColor }) {
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
  const { bikeabilityFeatures, anonymizedFeatures } =
    useContext(MapFeatureContext);
  const [isAnon, setIsAnon] = useState(false);
  const anonSwitchHandler = () => {
    setIsAnon(!isAnon);
  };

  if (
    bikeabilityFeatures === undefined ||
    bikeabilityFeatures.features === undefined ||
    anonymizedFeatures === undefined ||
    anonymizedFeatures.features === undefined
  ) {
    return <BaseTile height="h-[49rem]"></BaseTile>;
  }

  const inputFeatures = isAnon ? anonymizedFeatures : bikeabilityFeatures;

  //calculate total distance cycled
  const totalLength = inputFeatures.features.reduce(
    (accumulator, currentFeature) => {
      return accumulator + length(currentFeature, { units: "kilometers" });
    },
    0,
  );

  //calculate mean bikeability
  // TODO: adjust based on how bikeability for each route is calculated
  // if trajectory length is not considered in the bikeability of one, lose the distance factor
  const meanBikeability =
    inputFeatures.features.reduce((accumulator, currentFeature) => {
      return (
        accumulator +
        currentFeature.properties.factor_score *
          length(currentFeature, { units: "kilometers" })
      );
    }, 0) / totalLength;

  //count amount of trajectories
  const trajectoryAmount = inputFeatures.features.length;

  return (
    <BaseTile height="h-[49rem]">
      <p className="text-md font-semibold w-full mb-4">
        Bikeability-Statistik <br />
        <label class="inline-flex items-center mb-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            value=""
            class="sr-only peer"
            checked={isAnon}
            onChange={anonSwitchHandler}
          />
          <div class="relative w-9 h-5 mr-2 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          <span className="font-normal">
            {isAnon ? "" : "nicht-"}anonymisierte Sensordaten
          </span>
        </label>
      </p>
      <div className="flex flex-wrap flex-row justify-center w-full gap-2">
        <DynamicDataBox
          value={trajectoryAmount}
          decimals={0}
          unit=""
          header="Strecken im Datensatz"
          size="big"
          color={isAnon ? "bg-sky-500" : "bg-rose-500"}
        ></DynamicDataBox>
        <DynamicDataBox
          value={totalLength}
          decimals={2}
          unit="km"
          header="Distanz aller Strecken"
          size="big"
          color={isAnon ? "bg-sky-500" : "bg-rose-500"}
        ></DynamicDataBox>
        <DynamicDataBox
          value={meanBikeability}
          decimals={2}
          unit=""
          header="Bikeability Durchschnitt"
          size="big"
          color={isAnon ? "bg-sky-500" : "bg-rose-500"}
        ></DynamicDataBox>
        <BarChartMonths
          data={inputFeatures}
          chartColor={isAnon ? "blue" : "red"}
        />
      </div>
    </BaseTile>
  );
}

export default BikeabilityInfoTile;
