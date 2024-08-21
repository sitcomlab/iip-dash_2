"use client"
import { useRecoilState } from "recoil"

import useBikeInfrastructData from "@/hooks/useBikeInfrastructure"
import { cityViewConfigState } from "@components/RecoilContextProvider"
import { mapViewModeState } from "./BicycleInfrastructTile"
import LayerControl from "./LayerControl/LayerControl"
import Legend from "./LayerControl/Legend"

import AdministrativeAreas from "./mapContent/AdministrativeAreas"
import BicycleInfrastructureFeatures from "./mapContent/BicycleInfrastructureFeatures"

function BicycleInfrastructureData(){
    //regularly fetch bike infrastructure data
    //  get the city which we are looking at, and pass that to the bike infrastructure hook
    const [CityViewConfig] = useRecoilState(cityViewConfigState) 
    var BicycleInfrastructureData = useBikeInfrastructData(CityViewConfig.infrastructureSource)
    const [mapViewState] = useRecoilState(mapViewModeState)

    return(
        <>
        
        {mapViewState == 'AdministrativeAreas' &&
            //TODO: LayerControl, AndiminstrativeAreas component
            <LayerControl position="bottomright">
            <AdministrativeAreas
                contentGeometry={BicycleInfrastructureData}
            />
            </LayerControl>
        }


        {mapViewState == "BicycleNetwork" &&
            <LayerControl position="bottomright">
                <Legend position='bottomleft'>
                    <BicycleInfrastructureFeatures
                        contentGeometry={BicycleInfrastructureData}
                    />
                    <></>
                </Legend>
                <></>
            </LayerControl>
                }
        </>
    )
}

export default BicycleInfrastructureData