"use client"
import Menubar from "./Munubar"
import { useAppContext } from "@/components/AppContext"
import Toolbar from "./Toolbar"
import ChatList from "./ChatList"

export default function Navigation(){
  const {
    state: { displayNavigation }
  } = useAppContext()
  return (
    <nav 
      className={`${displayNavigation ? "" : "hidden"}
      flex flex-col
      bg-gray-900 w-[260px] h-full text-gray-300 p-2 relative`}>
      <Menubar />
      <ChatList />
      <Toolbar />
    </nav>
  )
}