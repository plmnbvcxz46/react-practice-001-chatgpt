import Button from "@/components/common/Button"
import { HiPlus } from "react-icons/hi"
import { LuPanelLeft } from "react-icons/lu"
export default function Navigation(){
  return (
    <div className="flex space-x-3">
      <Button 
      icon = {HiPlus}
      className="flex-1"
      variant= "outline">
        新建对话
      </Button>
      <Button
      icon = { LuPanelLeft }
      variant= "outline"></Button>
    </div>
  )
}