"use client"

import Main from "@/components/home/Main/index"
import Navigation from "@/components/home/Navigation/index"
import { useAppContext } from "@/components/AppContext"

export default function Home(){
  const { state: { theme } } = useAppContext()
  return(
    <div className={`${theme === "dark" ? "dark" : ""} flex h-full`}>
      <Navigation />
      <Main />
    </div>
  )
}