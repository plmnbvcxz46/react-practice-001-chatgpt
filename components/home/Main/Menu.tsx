"use client"

import Button from "@/components/common/Button"
import { useAppContext } from "@/components/AppContext"
import { LuPanelLeft } from "react-icons/lu"
import { ActionType } from "@/reducer/AppReducer"
export default function Menu(){
  const {
    state:{displayNavigation},
    dispatch
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
        dispatch({ type: ActionType.UPDATE, field: "displayNavigation", value: true})
      }}
    />
  )
}