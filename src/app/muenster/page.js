"use client"
import { cityViewConfigState } from "@/components/RecoilContextProvider"
import { useRecoilState } from "recoil"
import Image from "next/image"

import BaseTile from "@/components/BaseTile"
import BikeInfrastructTile from "@/components/BikeInfrastructTile/BicycleInfrastructTile"

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
            <main className="flex min-h-screen flex-col items-center justify-start gap-10 pt-24">
            <Image
                src="/icons/BicycleIconGreen.svg"
                alt="Vercel Logo"
                width={100}
                height={24}
                priority
            />
            <div className="flex flex-container flex-wrap flex-row-reverse w-5/6">
            <BikeInfrastructTile height="h-[49rem]">
            </BikeInfrastructTile>

                <div className="flex flex-container flex-wrap justify-end w-2/6">
                <BaseTile className="h-96">1</BaseTile>
                <BaseTile>2</BaseTile>
                <BaseTile>3</BaseTile>
                </div>
            </div>
            </main>

    )
}