import { useContext } from "react";
import BaseTile from "@components/BaseTile";
import { length } from "@turf/length";
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

  return (
    <BaseTile height="h-[49rem]">
      <div>distance cycled: {totalLength.toFixed(2)} km</div>
      <div>average bikeability: {meanBikeability.toFixed(2)}</div>
    </BaseTile>
  );
}

export default BikeabilityInfoTile;
