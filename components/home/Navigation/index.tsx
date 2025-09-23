"use client"
import Menubar from "./Munubar"
import { useAppContext } from "@/components/AppContext"
import Toolbar from "./Toolbar"

export default function Navigation(){
  const {
    state: { displayNavigation }
  } = useAppContext()
  return (
    <nav 
      className={`${displayNavigation ? "" : "hidden"}
      bg-gray-900 w-[260px] h-full text-gray-300 p-2 relative`}>
      <Menubar />
      <Toolbar />
    </nav>
  )
}