import { useEffect, useState } from 'react';

const INTERVAL = 60 * 60 * 12; // 1/2 day

//function to fetch the bicycle infrastructure
const getBikeInfrastructData = async (urlString) => {
    try {
        //TODO: remove that and put into .env at a later time to prevent leakage
        //let urlString = process.env.NEXT_PUBLIC_BICYCLE_INFRASTRUCTURE_URL;

        if (urlString == undefined){urlString =  ''}

        const res = await fetch(
            urlString,
        );
        const data = await res.json();

        return data;
    } catch (error) {

        //TODO: add error state
        return error
    }

}

export default function useBikeInfrastructData(urlString) {
    const [data, setData] = useState()
    const [loopIteration, setLoopIteration] = useState(() => {return 0})
    function incrementLoop(){
        setLoopIteration(prevLoop => prevLoop + 1)
    }

    //start new loop whenever the iteration counter has changed
    useEffect(() => {
        //get the data
        getBikeInfrastructData(urlString).then(e => setData(e))

        //start another cycle of the loop
        setTimeout(() => {
            //increment count again, so the loop starts anew.
            //this way the cycle breaks when the component isn't running anymore
            incrementLoop()
        }, INTERVAL * 1000)
    }, [loopIteration, urlString])

    useEffect(() => {
        if (!data) {
            return
        }

    })

    return data
}


// export default function useBikeabilityData (urlString) {
//     const [data, setData] = useState();

//     useEffect(() => {
//         const fetchData = async () => {
//             const response = await fetch(urlString);
//             const result = await response.json();
//             setData(result);
//         };

//         fetchData();
//     }, [urlString]);

//     return data;
// };
