"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Slider, Box, IconButton, Paper } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";

import { mapLoadingState, biWeightsState } from "@/components/RecoilContextProvider";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

const LabelWithColor = ({ color, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    <span style={{ display: "inline-block", width: 14, height: 14,
                   backgroundColor: color, borderRadius: 3 }} />
    <span>{text}</span>
  </div>
);

export default function BikeabilityWeightsControl({ position = "bottomright" }) {
  const positionClass = POSITION_CLASSES[position] || POSITION_CLASSES.bottomright;

  const map = useMap();

  const [, setMapLoading] = useRecoilState(mapLoadingState);
  const [, setWeightsGlobal] = useRecoilState(biWeightsState);

  const [collapsed, setCollapsed] = useState(false); // start OPEN (presenter preference)
  const [value, setValue] = useState([0.4, 0.9]);
  const [lastApplied, setLastApplied] = useState([0.4, 0.9]);

  const containerRef = useRef(null);

  // Only suppress scroll (wheel) propagation — this does NOT go through React's
  // synthetic event system, so it's safe. We deliberately DO NOT use
  // disableClickPropagation here, because its native stopPropagation on
  // mousedown kills the MUI Slider's drag/click (React 18 delegates events at
  // the root). Map panning is instead frozen via the enter/leave handlers below.
  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, [collapsed]);

  const freezeMap = () => {
    map.dragging.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
  };
  const unfreezeMap = () => {
    map.dragging.enable();
    map.doubleClickZoom.enable();
    map.boxZoom.enable();
  };

// Guarantee the map is ALWAYS released when any interaction ends — no matter
  // where it ends or whether the element that started it got disabled/re-rendered
  // (e.g. the "Anwenden" button disabling itself on tap). Freeze happens on
  // down (handlers below); this is the reliable release. Replaces the old
  // onTouchEnd/onMouseLeave, which could miss and leave the map frozen.
  useEffect(() => {
    const release = () => unfreezeMap();
    document.addEventListener("mouseup", release);
    document.addEventListener("touchend", release);
    document.addEventListener("touchcancel", release);
    document.addEventListener("pointerup", release);
    document.addEventListener("pointercancel", release);
    return () => {
      document.removeEventListener("mouseup", release);
      document.removeEventListener("touchend", release);
      document.removeEventListener("touchcancel", release);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", release);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safety = Math.round(value[0] * 100);
  const infra = Math.round((value[1] - value[0]) * 100);
  const env = Math.round((1 - value[1]) * 100);
  const dirty = value[0] !== lastApplied[0] || value[1] !== lastApplied[1];

  const marks = [{ value: 0.25 }, { value: 0.5 }, { value: 0.75 }];

  const pushWeights = () => {
    setMapLoading(true);
    const [x1, x2] = value;
    setWeightsGlobal({
      safety: Number(x1.toFixed(3)),
      infrastructure_quality: Number((x2 - x1).toFixed(3)),
      environment_quality: Number((1 - x2).toFixed(3)),
    });
    setLastApplied([Number(x1.toFixed(3)), Number(x2.toFixed(3))]);
  };

  return (
    <div className={positionClass}>
       <div
        className="leaflet-control leaflet-bar"
        ref={containerRef}
        onMouseDown={freezeMap}
        onTouchStart={freezeMap}
        style={{ border: "none", background: "transparent" }}
      >
        <Paper elevation={3} style={{ borderRadius: 12, overflow: "hidden" }}>
          {collapsed ? (
            <IconButton onClick={() => setCollapsed(false)}
                        title="Gewichtungen einstellen">
              <TuneIcon />
            </IconButton>
          ) : (
            <div style={{ width: 320, padding: "12px 16px", touchAction: "none" }}>
              <div style={{ display: "flex", alignItems: "center",
                            justifyContent: "space-between" }}>
                <span className="text-lg font-semibold">
                  Bikeability-Gewichtungen
                </span>
                <IconButton size="small" onClick={() => { unfreezeMap(); setCollapsed(true); }}
                            title="Schließen">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>

              <Box sx={{ width: "100%", px: 1, py: 3 }}>
                <Slider
                  getAriaLabel={() => "Bikeability Weights"}
                  value={value}
                  onChange={(e, v) => setValue(v)}
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
                        #f59e0b 100%)`,
                    },
                    "& .MuiSlider-track": { border: "none", background: "transparent" },
                    "& .MuiSlider-mark": {
                      backgroundColor: "#ffffff", opacity: 1,
                      height: 5, width: 5, borderRadius: "50%",
                    },
                    "& .MuiSlider-thumb": {
                      width: 20, height: 20,
                      "&:before": { boxShadow: "0 2px 12px rgba(0,0,0,0.4)" },
                    },
                  }}
                />
              </Box>

              <div className="space-y-2 text-lg">
                <LabelWithColor color="#3b82f6" text={`Verkehrssicherheit : ${safety}%`} />
                <LabelWithColor color="#22c55e" text={`Infrastrukturqualität : ${infra}%`} />
                <LabelWithColor color="#f59e0b" text={`Umweltqualität : ${env}%`} />
              </div>

              <div className="mt-3 flex items-center justify-between py-2">
                <p className={`text-sm text-red-600 font-semibold transition-opacity duration-200 ${dirty ? "opacity-100" : "opacity-0"}`}>
                  Geändert – <span className="font-medium">Anwenden</span> klicken.
                </p>
                <button
                  onClick={pushWeights}
                  disabled={!dirty}
                  className={`py-2 px-4 rounded-full transition-colors duration-200 ${
                    dirty ? "bg-blue-500 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  Anwenden
                </button>
              </div>
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
}
