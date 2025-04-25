import { useContext } from "react";
import { length } from "@turf/length";
import { useState } from "react";
import { Slider } from "@mui/material";
import { atom, useRecoilState } from 'recoil';

import BaseTile from "@components/BaseTile";
import { MapFeatureContext } from "@components/MapFeatureProvider";
import { biWeightsState } from "@/components/RecoilContextProvider";

/* refactor later. it has some problems with carrying on states and I dont want too many attribubtes
function WeightSlider({label, key, defaultValue, onChange}){
  return (
    <label>
      <p className="text-lg font-semibold w-full mt-2 mb-2">
        {label} <br />
      </p>
    <Slider
      aria-label={label}
      defaultValue={defaultValue}
      step={0.05}
      min={0}
      max={1}
      valueLabelDisplay="auto"
      onChange={(event, newValue) => { onChange(key, newValue)}}
      />
    </label>
  )
}
*/

function BIWeightsControlTile(){
  //expand by more weights once subindicators are implemented
  const [weights, setWeights] = useState({
    safety: 1,
    infrastructure_quality: 1,
    environment_quality: 1
  })
  const [weightsGlobal, setWeightsGlobal] = useRecoilState(biWeightsState)

  function updateWeight(key, value){
    setWeights(prevWeights => ({
      ...prevWeights,
      [key]: value
    }));
  }

  function pushNormalizedWeights(inputWeights){
    //TODO: guard against division by 0

    //normalize input weights
    const sumValues = obj => Object.values(obj).reduce((a, b) => a + b, 0);
    const inputWeightsSum = sumValues(inputWeights)
    for (const key in inputWeights) {
      if (inputWeights.hasOwnProperty(key)) {
        inputWeights[key] /= inputWeightsSum; //normalize the weights
      }
    }

    //set the weights
    setWeightsGlobal((prevWeights) => ({
      ...prevWeights,
      safety: inputWeights.safety,
      infrastructure_quality: inputWeights.infrastructure_quality,
      environment_quality: inputWeights.environment_quality
    }))
  }

  return(
    <BaseTile>
      <p className="text-lg font-semibold w-full mt-2 mb-8">
        Bikeability-Wichtungen <br />
      </p>


      <label >
        <p className="text-md font-normal w-full mt-2 mb-2">
          Sicherheit <br />
        </p>
        <Slider
          aria-label="Verkehrssicherheit"
          defaultValue={weights.environment_quality}
          step={0.05}
          min={0}
          max={1}
          valueLabelDisplay="auto"
          onChange={(event, newValue) => { updateWeight("safety", newValue)}}
        />
      </label>
      <hr/>
      <label>
        <p className="text-md font-normal w-full mt-2 mb-2">
          Infastruktur-Qualität <br />
        </p>
      <Slider
        aria-label="Infrastrukturqualität"
        defaultValue={weights.infrastructure_quality}
        step={0.05}
        min={0}
        max={1}
        valueLabelDisplay="auto"
        onChange={(event, newValue) => { updateWeight("infrastructure_quality", newValue)}}
      />
      </label>
      <hr/>
      <label>
        <p className="text-md font-normal w-full mt-2 mb-2">
          Umwelt-Qualität <br />
        </p>
      <Slider
        aria-label="Umweltqualität"
        defaultValue={weights.environment_quality}
        step={0.05}
        min={0}
        max={1}
        valueLabelDisplay="auto"
        onChange={(event, newValue) => { updateWeight("environment_quality", newValue)}}
      />
      </label>

      <div className="mt-3 relative">
        {/* TODO: style button more according to website style language */}
        <button
          className="bg-blue-500 absolute right-0 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-full"
          onClick={()=>{
            pushNormalizedWeights(weights)
          }}
        >
          Anwenden
        </button>
      </div>

      {/*
        <p>safety: {weightsGlobal.safety}, infrastructure quality: {weightsGlobal.infrastructure_quality}, environment_quality: {weightsGlobal.environment_quality}</p>
        */}
    </BaseTile>
  )
}

export default BIWeightsControlTile
