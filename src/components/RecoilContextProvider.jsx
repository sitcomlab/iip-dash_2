"use client";
import { RecoilRoot, atom } from "recoil";

/* This is where the atoms are declared
export const todoListState = atom({
    key: "TodoList",
    default: [],
  });
*/

export const cityViewConfigState = atom({
    key: 'CityViewConfig',
    default: {
        name: 'Münster',
        mapSettings: 
            {
                center: [51.962, 7.627],
                zoom: 12
            },
        infrastructureSource: process.env.NEXT_PUBLIC_BICYCLE_INFRASTRUCTURE_URL_MS
    } //default at Münster
})

export default function RecoilContextProvider({ children }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}