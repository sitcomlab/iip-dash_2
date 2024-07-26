"use client";
import { RecoilRoot, atom } from "recoil";

/* This is where the atoms are declared
export const todoListState = atom({
    key: "TodoList",
    default: [],
  });
*/

export default function RecoilContextProvider({ children }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}