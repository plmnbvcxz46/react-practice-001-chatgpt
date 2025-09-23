import Button from "@/components/common/Button"
import { MdDarkMode, MdInfo, MdLightMode } from "react-icons/md"
import { LuPanelLeft } from "react-icons/lu"
import { useAppContext } from "@/components/AppContext"

export default function Navigation(){
  const { state:{theme}, setState } = useAppContext()
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 flex p-2 justify-between">
      <Button 
        icon={theme == "light" ? MdLightMode : MdDarkMode}
        variant="text"
        onClick={() => {
          setState(v => ({
            ...v,
            theme: theme === "dark" ? "light" : "dark"
          }))
         }}
      />
      <Button
        icon={MdInfo}
        variant="text"
      />
    </div>
  )
}