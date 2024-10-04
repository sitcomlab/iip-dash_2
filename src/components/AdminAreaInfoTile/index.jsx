import { useRecoilState } from "recoil";
import { useState, useEffect, Suspense } from "react";
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import BaseTile from "@/components/BaseTile";
import AAInfoPages from "./AAInfoPages";
import { DataBoxBig, DataBox } from "./DataBox";

import { selectedAAState, selectedAAFeatureState, displayedPointDataState } from '@/components/RecoilContextProvider';

export const TilesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 100%;
  align-items: center;
`;

function AdminAreaInfoContent(props){

    if(props.feature.properties?.name === undefined){
        return <></>
    }

    return(
    <AAInfoPages name={props.adminArea}
        contentCycling={
            <TilesWrapper>
            <Suspense
            fallback={<Skeleton height="100%" width="100%" />}
            >
            <DataBoxBig
                decimals={2}
                header='Gesamtlänge'
                unit='Kilometer'
                value={
                    props.feature.properties.cycling.cyclingstreets.lengthKM
                }
            ></DataBoxBig>
            </Suspense>
        </TilesWrapper>
        }
        contentService={
            <TilesWrapper>
            <Suspense
            fallback={<Skeleton height="100%" width="100%" />}
            >
            <DataBox
                decimals={0}
                header='Läden innerhalb'
                unit=''
                value={
                    props.feature.properties.service.shopsWithin
                }
            ></DataBox>
            </Suspense>
            <Suspense
            fallback={<Skeleton height="100%" width="100%" />}
            >
            <DataBox
                decimals={0}
                header='Läden in der Nähe'
                unit=''
                value={
                    props.feature.properties.service.shopsNearby
                }
            ></DataBox>
            </Suspense>
            <Suspense
            fallback={<Skeleton height="100%" width="100%" />}
            >
            <DataBox
                decimals={2}
                header='Abdeckung'
                unit='%'
                value={
                    props.feature.properties.service.coverage
                }
            ></DataBox>
            </Suspense>
            </TilesWrapper>
        }
    >
    </AAInfoPages>
    )
}


function AdminAreaInfoTile(){
    const [pinned, setPinned] = useState(false)

    const [selectedAA, setSelectedAA] = useRecoilState(selectedAAState)
    const [selectedAAFeature, setSelectedAAFeature] = useRecoilState(selectedAAFeatureState)
    const [displayedPointData, setDisplayedPointData] = useRecoilState(displayedPointDataState)

    const [selectedAA_pinned, setSelectedAA_pinned] = useState(false)
    const [selectedAAFeature_pinned, setSelectedAAFeature_pinned] = useState(false)

    const feature = selectedAAFeature

    //when invoked, the displayed information will be pinned
    function pin(){
        setSelectedAA_pinned(selectedAA)
        setSelectedAAFeature_pinned(selectedAAFeature)
        setPinned(true)
        console.log(pinned)
    }

    //TODO: figure out how to implement a remove-button for this component
    function remove(){

    }

    return (
        <BaseTile>
        { !pinned &&
        <>  
        <button onClick={pin}>pin</button>
            <AdminAreaInfoContent 
                adminArea={selectedAA}
                feature={selectedAAFeature}
            />
        </>
        }

        { pinned && 
            <>
            <AdminAreaInfoContent 
                adminArea={selectedAA_pinned}
                feature={selectedAAFeature_pinned}
            />
            </>
        }
        </BaseTile>
    )
}

export default AdminAreaInfoTile