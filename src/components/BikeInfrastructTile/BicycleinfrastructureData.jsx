"use client"
import { useRecoilState } from "recoil"

import useBikeInfrastructData from "@/app/hooks/useBikeInfrastructure"
import { cityViewConfigState } from "@components/RecoilContextProvider"
import { mapViewModeState } from "./BicycleInfrastructTile"
import AdministrativeAreas from "./mapContent/AdministrativeAreas"

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
            <AdministrativeAreas
                contentGeometry={BicycleInfrastructureData}
            />
        }

        {mapViewState == 'BicycleNetwork' &&
            //TODO: LayerControl, Legend, BicycleinfrastructureFeatures component
            <></>
        }
        </>
    )
}

export default BicycleInfrastructureData