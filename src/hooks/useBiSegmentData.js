import { useState, useEffect } from "react";
import { mapLoadingState } from "@/components/RecoilContextProvider";
import { useRecoilState } from "recoil";

export default function useBiSegmentData(url, weights) {
  const [data, setData] = useState(null);
  const [mapLoading, setMapLoading] = useRecoilState(mapLoadingState)

  useEffect(() => {
    if (!url) return;

    async function fetchData() {
      setMapLoading(true);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(weights),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
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
