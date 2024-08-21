import { useRecoilState } from "recoil";
import { useState } from "react";

import BaseTile from "@/components/BaseTile";

import { selectedAAState, selectedAAFeatureState, displayedPointDataState } from '@/components/RecoilContextProvider';

function AdminAreaInfoTile(){
    const [pinned, setPinned] = useState(false)

    const [selectedAA, setSelectedAA] = useRecoilState(selectedAAState)
    const [selectedAAFeature, setSelectedAAFeature] = useRecoilState(selectedAAFeatureState)
    const [displayedPointData, setDisplayedPointData] = useRecoilState(displayedPointDataState)

    const [selectedAA_pinned, setSelectedAA_pinned] = useState(false)
    const [selectedAAFeature_pinned, setSelectedAAFeature_pinned] = useState(false)


    //when invoked, the displayed information will be pinned
    function pin(){
        setSelectedAA_pinned(selectedAA)
        setSelectedAAFeature_pinned(selectedAAFeature_pinned)
        setPinned(true)
        console.log(pinned)
    }

    //TODO: figure out how to implement a remove-button for this component
    function remove(){

    }

    return (
        <>
        { !pinned &&
            <BaseTile>
            <h1 className="font-bold">Admin-Area info tile</h1>
            <p>This is where information on the selected administrative area will be shown</p>
            <p>selected AA: {selectedAA}</p>
            <button onClick={pin}>pin</button>
            </BaseTile>
        }
        { pinned && 
            <BaseTile>
            <h1 className="font-bold">Admin-Area info tile</h1>
            <p>This is where information on the selected administrative area will be shown</p>
            <p>selected AA: {selectedAA_pinned}</p>
            </BaseTile>
        }
        </>
    )
}

export default AdminAreaInfoTile