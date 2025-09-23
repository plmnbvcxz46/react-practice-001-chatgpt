"use client"

import Main from "@/components/home/Main/index"
import Navigation from "@/components/home/Navigation/index"
import { useAppContext } from "@/components/AppContext"

export default function Home(){
  const { state: { themeMode } } = useAppContext()
  return(
    <div className={`${themeMode === "dark" ? "dark" : ""} flex h-full`}>
      <Navigation />
      <Main />
    </div>
  )
}