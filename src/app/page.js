import Image from "next/image";
import BaseTile from "@components/BaseTile";
import MapTile from "@components/mapTile/MapTile";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-10 pt-24">
      <Image
        src="/icons/BicycleIconGreen.svg"
        alt="Vercel Logo"
        width={100}
        height={24}
        priority
      />
      <div className="flex flex-container flex-wrap w-5/6">
        <div className="flex flex-container flex-wrap justify-end w-2/6">
          <BaseTile className="h-96">1</BaseTile>
          <BaseTile>2</BaseTile>
          <BaseTile>3</BaseTile>
        </div>
        <MapTile height="">

        </MapTile>
      </div>
    </main>
  );
}
