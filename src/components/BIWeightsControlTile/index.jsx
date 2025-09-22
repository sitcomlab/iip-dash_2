import { useContext } from "react";
import { length } from "@turf/length";
import { useState, useRef, useEffect  } from "react";
import { Slider } from "@mui/material";
import { atom, useRecoilState } from 'recoil';
import InfoElement from "../Elements/InfoElement";

import { mapLoadingState } from '@/components/RecoilContextProvider';
import BaseTile from "@components/BaseTile";
import { MapFeatureContext } from "@components/MapFeatureProvider";
import { biWeightsState } from "@/components/RecoilContextProvider";
import Box from "@mui/material/Box";

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

// function BIWeightsControlTile(){
//   //expand by more weights once subindicators are implemented
//   const [mapLoading, setMapLoading] = useRecoilState(mapLoadingState)
//   const [weights, setWeights] = useState({
//     safety: 1,
//     infrastructure_quality: 1,
//     environment_quality: 1
//   })
//   const [weightsGlobal, setWeightsGlobal] = useRecoilState(biWeightsState)

//   function updateWeight(key, value){
//     setWeights(prevWeights => ({
//       ...prevWeights,
//       [key]: value
//     }));
//   }

//   function pushNormalizedWeights(inputWeights){
//     //TODO: guard against division by 0

//     //normalize input weights
//     const sumValues = obj => Object.values(obj).reduce((a, b) => a + b, 0);
//     const inputWeightsSum = sumValues(inputWeights)
//     for (const key in inputWeights) {
//       if (inputWeights.hasOwnProperty(key)) {
//         inputWeights[key] /= inputWeightsSum; //normalize the weights
//         inputWeights[key] = Number(inputWeights[key].toFixed(3));
//       }
//     }

//     //set the weights
//     setWeightsGlobal((prevWeights) => ({
//       ...prevWeights,
//       safety: inputWeights.safety,
//       infrastructure_quality: inputWeights.infrastructure_quality,
//       environment_quality: inputWeights.environment_quality
//     }))

//     setMapLoading(true);
//     console.log("Normalized weights applied:", inputWeights);
//   }

//   return(
//     <BaseTile height="h-96" width="col-span-1">
//       <p className="text-lg font-semibold w-full mt-2 mb-8">
//         Bikeability-Wichtungen <br />
//       </p>


//       <label >
//         <p className="text-md font-normal w-full mt-2 mb-2">
//           Sicherheit <br />
//         </p>
//         <Slider
//           aria-label="Verkehrssicherheit"
//           defaultValue={weights.environment_quality}
//           step={0.05}
//           min={0}
//           max={1}
//           valueLabelDisplay="auto"
//           onChange={(event, newValue) => { updateWeight("safety", newValue)}}
//         />
//       </label>
//       <hr/>
//       <label>
//         <p className="text-md font-normal w-full mt-2 mb-2">
//           Infastruktur-Qualität <br />
//         </p>
//       <Slider
//         aria-label="Infrastrukturqualität"
//         defaultValue={weights.infrastructure_quality}
//         step={0.05}
//         min={0}
//         max={1}
//         valueLabelDisplay="auto"
//         onChange={(event, newValue) => { updateWeight("infrastructure_quality", newValue)}}
//       />
//       </label>
//       <hr/>
//       <label>
//         <p className="text-md font-normal w-full mt-2 mb-2">
//           Umwelt-Qualität <br />
//         </p>
//       <Slider
//         aria-label="Umweltqualität"
//         defaultValue={weights.environment_quality}
//         step={0.05}
//         min={0}
//         max={1}
//         valueLabelDisplay="auto"
//         onChange={(event, newValue) => { updateWeight("environment_quality", newValue)}}
//       />
//       </label>

//       <div className="mt-3 relative">
//         {/* TODO: style button more according to website style language */}
//         <button
//           className="bg-blue-500 absolute right-0 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-full"
//           onClick={()=>{
//             pushNormalizedWeights(weights)
//           }}
//         >
//           Anwenden
//         </button>
//       </div>

//       {/*
//         <p>safety: {weightsGlobal.safety}, infrastructure quality: {weightsGlobal.infrastructure_quality}, environment_quality: {weightsGlobal.environment_quality}</p>
//         */}
//     </BaseTile>
//   )
// }

// export default BIWeightsControlTile


// Range Slider
export default function BIWeightsControlTile() {
  const [mapLoading, setMapLoading] = useRecoilState(mapLoadingState);
  const [weightsGlobal, setWeightsGlobal] = useRecoilState(biWeightsState);

  const pushWeights = () => {
    setMapLoading(true);
    const [x1, x2] = value;

    // direct mapping (no normalization!)
    const newWeights = {
      safety: Number(x1.toFixed(3)),
      infrastructure_quality: Number((x2 - x1).toFixed(3)),
      environment_quality: Number((1 - x2).toFixed(3)),
    };

    setWeightsGlobal(newWeights);
    console.log("Applied weights:", newWeights);
  };

  // slider positions (two handles)
  const [value, setValue] = useState([0.4, 0.9]);
  const [lastApplied, setLastApplied] = useState([0.4, 0.9]);
  // const debounceRef = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const safety = Math.round(value[0] * 100);
  const infra = Math.round((value[1] - value[0]) * 100);
  const env = Math.round((1 - value[1]) * 100);

    // --- check if slider changed compared to last applied ---
  const dirty = value[0] !== lastApplied[0] || value[1] !== lastApplied[1];

  const marks = [
    // { value: 0, label: "0%" },
    { value: 0.25},
    { value: 0.50},
    { value: 0.75},
    // { value: 1, label: "100%" }
  ];

  // Helper component for label with colored square
  const LabelWithColor = ({ color, text }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span
        style={{
          display: "inline-block",
          width: "14px",
          height: "14px",
          backgroundColor: color,
          borderRadius: "3px"
        }}
      ></span>
      <span>{text}</span>
    </div>
  );


  return (
    <BaseTile height="h-96" width="col-span-1">
      <div className="text-lg font-semibold mt-2 mb-4">
        Bikeability-Gewichtungen <InfoElement content='Hier können Ihre Prioritäten gesetzt werden. Klicken Sie "Anwenden" um die veränderungen auf der Karte zu sehen'/><br />
      </div>

      <Box sx={{ width: "100%", px: 2, py: 4 }}>
        <Slider
          getAriaLabel={() => "Bikeability Weights"}
          value={value}
          onChange={handleChange}
          // onChangeCommitted={(e, newValue) => {
          //   if (debounceRef.current) clearTimeout(debounceRef.current);

          //   debounceRef.current = setTimeout(() => {
          //     pushWeights(newValue);
          //     console.log("Pushed weights:", newValue);
          //   }, 1500);
          // }}
          step={0.01}
          min={0}
          max={1}
          valueLabelDisplay="auto"
          marks={marks}
          sx={{
            height: 10,
            "& .MuiSlider-rail": {
              opacity: 1,
              background: `linear-gradient(
                to right,
                #3b82f6 0%,
                #3b82f6 ${value[0] * 100}%,
                #22c55e ${value[0] * 100}%,
                #22c55e ${value[1] * 100}%,
                #f59e0b ${value[1] * 100}%,
                #f59e0b 100%
              )`
            },
            "& .MuiSlider-track": {
              border: "none",
              background: "transparent"
            },
            "& .MuiSlider-mark": {
              backgroundColor: "#ffffffff",
              opacity: 1,
              height: 5,
              width: 5,
              borderRadius: "50%",
            },
            "& .MuiSlider-thumb": {
              width: 20,
              height: 20,
              "&:before": {
                boxShadow: "0 2px 12px rgba(0,0,0,0.4)"
              }
            }
          }}
        />
      </Box>

      {/* Show weights live */}
      <div className="space-y-2 text-lg">
        <LabelWithColor color="#3b82f6" text={`Verkehrssicherheit : ${safety}%`} />
        <LabelWithColor color="#22c55e" text={`Infrastrukturqualität : ${infra}%`} />
        <LabelWithColor color="#f59e0b" text={`Umweltqualität : ${env}%`} />
      </div>

      {/* Apply section: only visible/enabled when slider changed */}
      <div className="mt-3 flex items-center justify-between py-2">
        <p
          className={`text-sm text-gray-600 transition-opacity duration-200 ${
            dirty ? "opacity-100" : "opacity-0"
          }`}
        >
          Gewichtungen wurden geändert – <span className="font-medium">Anwenden</span> klicken.
        </p>

        <button
          onClick={() => {
            pushWeights();
            setLastApplied([Number(value[0].toFixed(3)), Number(value[1].toFixed(3))]);
          }}
          disabled={!dirty}
          className={`py-2 px-4 rounded-full transition-colors duration-200 ${
            dirty
              ? "bg-blue-500 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Anwenden
        </button>
      </div>


    </BaseTile>
  );
}
