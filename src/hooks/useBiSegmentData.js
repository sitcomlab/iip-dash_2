import { useState, useEffect } from "react";
import { mapLoadingState } from "@/components/RecoilContextProvider";
import { useRecoilState } from "recoil";
import Pbf from "pbf";
import geobuf from "geobuf";

export default function useBiSegmentData(url, weights) {
  const [data, setData] = useState(null);
  const [mapLoading, setMapLoading] = useRecoilState(mapLoadingState)

  useEffect(() => {
    if (!url) return;

    async function fetchData() {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          body: JSON.stringify(weights),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.arrayBuffer();
        const jsonData = geobuf.decode(new Pbf(new Uint8Array(data)))
        console.log(data)
        console.log(jsonData)
        setData(jsonData);
        setMapLoading(false);
      } catch (error) {
        console.error("Failed to fetch biSegment data:", error);
        setData(null);
      }
    }

    fetchData();
  }, [url, weights]);

  return data;
}
