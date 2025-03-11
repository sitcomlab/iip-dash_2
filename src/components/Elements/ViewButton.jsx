import * as React from "react";
import { mapViewModeState } from "../RecoilContextProvider";
import { SVGProps } from "react";
import { useRecoilState } from "recoil";

function ViewButton({ type }) {
  const [mapViewState, setMapViewState] = useRecoilState(mapViewModeState);

  if (type == "AdministrativeAreas") {
    if (mapViewState == "AdministrativeAreas") {
      return (
        <button
          className="
                    py-2 px-5 rounded-full border border-theme-green
                     bg-theme-green text-theme-green-light"
          buttonText="Stadtteile"
          Mode
          onClick={() => {
            return;
          }}
          type={type}
        >
          Stadtteile
        </button>
      );
    } else {
      return (
        <button
          className="
                    py-2 px-5 rounded-full border border-theme-green
                     bg-theme-green-light text-theme-green
                    hover:bg-theme-green hover:text-theme-green-light"
          buttonText="Stadtteile"
          //mapViewContext={mapViewState}
          onClick={() => {
            return setMapViewState(type);
          }}
          type={type}
        >
          Stadtteile
        </button>
      );
    }
  }

  if (type == "BicycleNetwork") {
    if (mapViewState == "BicycleNetwork") {
      return (
        <button
          className="
                    py-2 px-5 rounded-full border border-theme-green
                     bg-theme-green text-theme-green-light"
          buttonText="Stadtteile"
          Mode
          onClick={() => {
            return;
          }}
          type={type}
        >
          Radnetz
        </button>
      );
    } else {
      return (
        <button
          className="
                    py-2 px-5 rounded-full border border-theme-green
                    bg-theme-green-light text-theme-green
                    hover:bg-theme-green hover:text-theme-green-light"
          buttonText="Stadtteile"
          //mapViewContext={mapViewState}
          onClick={() => {
            return setMapViewState(type);
          }}
          type={type}
        >
          Radnetz
        </button>
      );
    }
  }

  //  Adding the Bikeability Button
  if (type === "Bikeability") {
    if (mapViewState === "Bikeability") {
      return (
        <button
          className="py-2 px-5 rounded-full border border-theme-green bg-theme-green text-theme-green-light"
          buttonText="Bikeability"
          Mode
          onClick={() => {
            return;
          }}
          type={type}
        >
          Bikeability
        </button>
      );
    } else {
      return (
        <button
          className="py-2 px-5 rounded-full border border-theme-green bg-theme-green-light text-theme-green
                    hover:bg-theme-green hover:text-theme-green-light"
          buttonText="Bikeability"
          onClick={() => setMapViewState(type)}
          type={type}
        >
          Bikeability
        </button>
      );
    }
  }
  //this shall not be reached
  return <></>;
}

export default ViewButton;
