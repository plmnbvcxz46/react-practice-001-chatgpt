import { MdOutlineTipsAndUpdates } from "react-icons/md"
import examples from "@/data/examples.json"
import Button from "@/components/common/Button"
import { useMemo, useState } from "react"

export default function Example(){
  const [showFull, setshowFull] = useState(false)
  const list = useMemo(() => {
    if(showFull) {
      return examples
    }else{
      return examples.slice(0, 15)
    }
  }, [showFull])
  return(
    <div className="mb-40 mt-auto">
        <div className="flex justify-center mt-20 mb-4 text-4xl">
          <MdOutlineTipsAndUpdates />
        </div>
        <ul className="flex justify-center flex-wrap gap-3.5 p-1.5">
          {
            list.map((item)=>{
              return <li key={item.act}>
                <Button>{item.act}</Button>
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