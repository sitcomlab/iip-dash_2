import React from "react"

/*
props.decimals
props.value
prpos.unit
props.header
*/
function DataBoxBig(props) {

    const valueRound = Math.round(props.value*(10**props.decimals)) / (10**props.decimals)

    return(
        <div className="
            w-[9.5rem] h-[9.5rem] 
            bg-sky-500
            mt-0 pt-0 m-0.5 p-0.5
            rounded-2xl
            shadow-lg

            text-white text-base
            flex flex-col items-center justify-center
        ">
            <div className="text-xl font-semibold">{props.header}</div>
            <div className="text-2xl font-semibold">{valueRound}</div>
            <div className="text-base font-semibold">{props.unit}</div>
        </div>
    )
}

function DataBox(props) {
    const valueRound = Math.round(props.value*(10**props.decimals)) / (10**props.decimals)

    return(
        <div className="
            w-[7rem] h-[7rem] 
            bg-sky-500
            mt-0 pt-0 m-0.5 p-0.5
            rounded-2xl
            shadow-lg

            text-white text-base text-center
            flex flex-col items-center justify-center
        ">
            <div className="text-base font-semibold">{props.header}</div>
            <div className="text-lg font-semibold">{valueRound}</div>
            <div className="text-sm font-semibold">{props.unit}</div>
        </div>
    )
}

export { DataBoxBig, DataBox }