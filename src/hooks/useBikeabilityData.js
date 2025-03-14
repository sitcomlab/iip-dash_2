import { useEffect, useState } from 'react';

const INTERVAL = 60 * 60 * 12; // 1/2 day

const getBikeabilityData = async (urlString) => {
    try {
        if (urlString === undefined) {
            urlString = '';
        }

        const res = await fetch(urlString);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching bikeability data:", error); // Log the error
        return null; // Return null on error
    }
}

export default function useBikeabilityData(urlString) {
    const [data, setData] = useState();
    const [loopIteration, setLoopIteration] = useState(0);

    function incrementLoop() {
        setLoopIteration(prevLoop => prevLoop + 1);
    }

    useEffect(() => {
        getBikeabilityData(urlString).then(e => setData(e));

        const timer = setTimeout(() => {
            incrementLoop();
        }, INTERVAL * 1000);

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [loopIteration, urlString]);

    return data;
}
