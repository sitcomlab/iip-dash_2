import { useState, useEffect } from "react";

export default function useBiSegmentData(url, weights) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!url) return;

    async function fetchData() {
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
      } catch (error) {
        console.error("Failed to fetch biSegment data:", error);
        setData(null);
      }
    }

    fetchData();
  }, [url, weights]);

  return data;
}
