"use client"
import { cityViewConfigState } from "@/components/RecoilContextProvider"
import { useRecoilState } from "recoil"

const cityConfig = 
    {
        name: 'Münster',
        mapSettings: 
            {
                center: [51.962, 7.627],
                zoom: 12
            },
        infrastructureSource: process.env.NEXT_PUBLIC_BICYCLE_INFRASTRUCTURE_URL_MS
    }

export default function Münster(){
    const [cityViewConfig, setCityViewConfig] = useRecoilState(cityViewConfigState)
    setCityViewConfig(cityConfig)

    return(
        <h1>This will be the {cityViewConfig.name} ip dashboard</h1>
    )
}