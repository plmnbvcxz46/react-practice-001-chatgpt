import Button from "@/components/common/Button"
import { MdDarkMode, MdInfo, MdLightMode } from "react-icons/md"
import { useAppContext } from "@/components/AppContext"
import { ActionType } from "@/reducer/AppReducer"

export default function Navigation(){
  const { state:{ themeMode }, dispatch } = useAppContext()
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 flex p-2 justify-between">
      <Button 
        icon={themeMode == "light" ? MdLightMode : MdDarkMode}
        variant="text"
        onClick={() => {
          dispatch({
            type: ActionType.UPDATE,
            field: "themeMode",
            value: themeMode === "light" ? "dark" : "light"
          })
         }}
      />
      <Button
        icon={MdInfo}
        variant="text"
      />
    </div>
  )
}