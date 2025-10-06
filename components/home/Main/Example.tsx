import { MdOutlineTipsAndUpdates } from "react-icons/md"
import examples from "@/data/examples.json"
import Button from "@/components/common/Button"
import { useMemo, useState } from "react"
import { useEventBusContext } from "@/components/EventBusContext"

export default function Example(){
  const [showFull, setshowFull] = useState(false)
  const { publish } = useEventBusContext()
  const list = useMemo(() => {
    if(showFull) {
      return examples
    }else{
      return examples.slice(0, 15)
    }
  }, [showFull])
  return(
    <div className="mt-8">
        <div className="flex justify-center mt-8 mb-4 text-4xl">
          <MdOutlineTipsAndUpdates />
        </div>
        <ul className="flex justify-center flex-wrap gap-3.5 p-1.5">
          {
            list.map((item)=>{
              return <li key={item.act}>
                <Button onClick={() => publish("newChatWithPrompt", item.prompt)}>{item.act}</Button>
              </li>
            })
          }
        </ul>
        {
          (
            <>
              <p className="p-2 text-center">{!showFull && "..."}</p>
              <div className="flex items-center justify-center w-full space-x-2 mt-10">
                <hr className="flex-1 border-t border-dotted border-gray-300 dark:border-gray-600"/>
                  <Button onClick={() => setshowFull(!showFull)}>{ !showFull ? "展示全部" : "收起"}</Button>
                <hr className="flex-1 border-t border-dotted border-gray-300 dark:border-gray-600"/>
              </div>
            </>
          )
        }
    </div>
  )
}