"use client"
import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import { usePathname } from 'next/navigation';

//TODO: add city symbols

function NavButton(props){
    const path = usePathname();
    const content = props.children;
    const link = props.href;

    if ( path === link ){
        return(
        <button
            className='
            sm:py-4 px-6 sm:px-8 rounded-full border border-theme-green
            bg-theme-green text-theme-green-light'
        >
            {content}
        </button>           )
    }

    return (
        <button
            className='
            sm:py-4 px-6 sm:px-8 rounded-full border border-theme-green
            bg-theme-green-light text-theme-green
            hover:bg-theme-green hover:text-theme-green-light'
            onClick={()=>{location.href = link}}
        >
            {content}
        </button>
    )
}

export default function Navbar(props){
    const classes = props.className
    return(
      <>
        <div className={classes}>
            <div className='flex justify-between items-center w-full'>
              {/* Left side: Bicycle icon + city buttons */}
              <div className='flex gap-5 items-center'>
                <Image
                  src="/icons/BicycleIconGreen.svg"
                  alt="Bicycle Icon"
                  width={50}
                  height={15}
                  priority
                />
                <NavButton href="/muenster">Münster</NavButton>
                <NavButton href="/osnabrueck">Osnabrück</NavButton>
              </div>
              {/* Right side: Funding info + logos (hidden on mobile) */}
              <div className='hidden lg:flex gap-4 items-center'>
                <div className='flex flex-col items-end'>
                  <span className='text-xs text-gray-500'>
                    Gefördert durch:
                  </span>
                  <span className='text-xs text-gray-500'>
                    (Förderkennzeichen: 16KISA121)
                  </span>
                </div>
                <img
                  src="/BFTRlogo.svg"
                  alt="BFTR Logo"
                  className='h-10 w-auto object-contain'
                />
                <img
                  src="/DE_Finanziert_von_der_EU_RG_POS.png"
                  alt="EU Funding Logo"
                  className='h-10 w-auto object-contain'
                />
              </div>
            </div>
        </div>
      </>
    )
}

export {NavButton}
