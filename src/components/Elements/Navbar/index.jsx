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
            py-4 px-8 rounded-full border border-theme-green
             bg-theme-green text-theme-green-light'
        >
            {content}
        </button>           )
    }

    return (
        <button
            className='
            py-4 px-8 rounded-full border border-theme-green
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
            <div className='flex gap-5'>
              <Image
                src="/icons/BicycleIconGreen.svg"
                alt="Vercel Logo"
                width={50}
                height={15}
                priority
              />
              <NavButton href="/muenster">Münster</NavButton>
              <NavButton href="/osnabrueck">Osnabrück</NavButton>
            </div>
        </div>
      </>
    )
}

export {NavButton}
