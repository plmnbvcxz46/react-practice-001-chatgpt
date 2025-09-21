"use client"

import Button from "@/components/common/Button"
import { useAppContext } from "@/components/AppContext"
import { LuPanelLeft } from "react-icons/lu"

export default function Menu(){
  const {
    state:{displayNavigation},
    setState
    } = useAppContext()
  return (
    <Button
      icon = { LuPanelLeft }
      className={`${
        displayNavigation? "!hidden" : ""}
        fixed top-2 left-2
        `}
      variant= "outline"
      onClick={() => {
        setState((v)=>({
          ...v,
          displayNavigation: true
        }))
      }}
    />
  )
}