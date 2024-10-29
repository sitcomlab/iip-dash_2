"use client";
import { cityViewConfigState } from "@/components/RecoilContextProvider";
import { useRecoilState } from "recoil";
import Image from "next/image";
import dynamic from "next/dynamic";

import Navbar from "@/components/Elements/Navbar";
import AdminAreaInfoTile from "@/components/AdminAreaInfoTile";
const BikeInfrastructTile = dynamic(
  () => import("@/components/BikeInfrastructTile/BicycleInfrastructTile"),
  { ssr: false },
);

const cityConfig = {
  name: "Osnabrück",
  mapSettings: {
    center: [52.279, 8.047],
    zoom: 12,
  },
  infrastructureSource: process.env.NEXT_PUBLIC_BICYCLE_INFRASTRUCTURE_URL_OS,
};

export default function Münster() {
  const [cityViewConfig, setCityViewConfig] =
    useRecoilState(cityViewConfigState);
  setCityViewConfig(cityConfig);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-10 pt-24">
      <Image
        src="/icons/BicycleIconGreen.svg"
        alt="Vercel Logo"
        width={100}
        height={24}
        priority
      />
      <Navbar className="w-5/6" />
      <div className="flex flex-container flex-wrap flex-row-reverse w-5/6">
        <BikeInfrastructTile height="h-[49rem]"></BikeInfrastructTile>

        <div className="flex flex-container flex-wrap justify-end w-2/6">
          <AdminAreaInfoTile></AdminAreaInfoTile>
        </div>
      </div>
    </main>
  );
}
