"use client"
import { useRecoilState } from "recoil"

import useBikeInfrastructData from "@/hooks/useBikeInfrastructure"
import { cityViewConfigState } from "@components/RecoilContextProvider"
import { mapViewModeState } from "./BicycleInfrastructTile"
import AdministrativeAreas from "./mapContent/AdministrativeAreas"
import LayerControl from "./LayerControl/LayerControl"

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

        {mapViewState == 'BicycleNetwork' &&
            //TODO: LayerControl, Legend, BicycleinfrastructureFeatures component
            <></>
        }
        </>
    )
}

export default BicycleInfrastructureData