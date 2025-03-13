import { useContext } from "react";
import { length } from "@turf/length";

import BaseTile from "@components/BaseTile";
import { DynamicDataBox } from "./DynamicDataBox";
import { MapFeatureContext } from "@components/MapFeatureProvider";

function BikeabilityInfoTile() {
  const { bikeabilityFeatures } = useContext(MapFeatureContext);

  if (
    bikeabilityFeatures === undefined ||
    bikeabilityFeatures.features === undefined
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
      </div>
    </BaseTile>
  );
}

export default BikeabilityInfoTile;
