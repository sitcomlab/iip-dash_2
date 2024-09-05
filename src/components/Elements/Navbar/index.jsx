"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavButton(props){
    const path = usePathname();
    const content = props.children;
    const link = props.href;

    if ( path === link ){
        return(        
        <button
            className='
            py-2 px-5 rounded-full border border-theme-green
             bg-theme-green text-theme-green-light'
        >
        {content}
        </button>           )
    }

    return (
        <button
            className='
            py-2 px-5 rounded-full border border-theme-green
            bg-theme-green-light text-theme-green 
            hover:bg-theme-green hover:text-theme-green-light'
            onClick={()=>{location.href = link}}
        >
            {content}
        </button>
    )
}

export default function Navbar(){
    return(
        <div>
            <li>
                <NavButton href="/muenster">Münster</NavButton>
            </li>
            <li>
                <NavButton href="/">Test</NavButton>
            </li>
        </div>
    )
}

export {NavButton}