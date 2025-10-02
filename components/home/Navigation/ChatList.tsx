import { useEffect, useMemo, useState } from "react"
import { Chat } from "@/types/chat"
import { AiOutlineEdit } from "react-icons/ai"
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md"
import { PiChatBold, PiTrashBold } from "react-icons/pi"
import { groupByDate } from "@/common/util"
import { useEventBusContext } from "@/components/EventBusContext"

export default function ChatList(){
  const [chatlist, setchatlist] = useState<Chat[]>([
    { id: "1", title: "1first first first first first first first", uptime: Date.now() + 0 },
    { id: "2", title: "1first first first first first first first", uptime: Date.now() + 0 },
    { id: "3", title: "1first first first first first first first", uptime: Date.now() + 0 },
    { id: "4", title: "1first first first first first first first", uptime: Date.now() + 0 },
    { id: "5", title: "1first first first first first first first", uptime: Date.now() + 0 },
    { id: "6", title: "1first first first first first first first", uptime: Date.now() + 0 },
    { id: "7", title: "2second second second second second second second second", uptime: Date.now() + 1 },
    { id: "8", title: "3third third third third third third third third third third third third", uptime: Date.now() + 2 },
    { id: "9", title: "4fourth: discuss project plan and milestones", uptime: Date.now() + 3 },
    { id: "10", title: "5sixteenth: security audit follow-up", uptime: Date.now() + 15 },
    { id: "11", title: "6seventeenth: dependency upgrades", uptime: Date.now() + 16 },
    { id: "12", title: "7eighteenth: localization tasks", uptime: Date.now() + 17 },
    { id: "13", title: "8nineteenth: analytics and tracking", uptime: Date.now() + 18 },
    { id: "14", title: "9twentieth: roadmap planning and Q&A", uptime: Date.now() + 19 },
    { id: "15", title: "1first first first first first first first", uptime: Date.now() + 0 },
    { id: "16", title: "2second second second second second second second second", uptime: Date.now() + 1 },
    { id: "17", title: "3third third third third third third third third third third third third", uptime: Date.now() + 2 },
    { id: "18", title: "4fourth: discuss project plan and milestones", uptime: Date.now() + 3 },
    { id: "19", title: "5sixteenth: security audit follow-up", uptime: Date.now() + 15 },
    { id: "20", title: "6seventeenth: dependency upgrades", uptime: Date.now() + 16 },
    { id: "21", title: "7eighteenth: localization tasks", uptime: Date.now() + 17 },
    { id: "22", title: "8nineteenth: analytics and tracking", uptime: Date.now() + 18 },
    { id: "23", title: "9twentieth: roadmap planning and Q&A", uptime: Date.now() + 19 }
  ])
  const [selectedChat, setselectedChat] = useState<Chat | undefined>()
  const groupList = useMemo(()=>{
    return groupByDate(chatlist)
  },[chatlist])
  const {subscribe, unsubscribe} = useEventBusContext()

  useEffect(() => {
    const callback: EventListener = () => {
      console.log("fetchchatlist")
    }
    subscribe("fetchchatlist", callback)
    return () => unsubscribe("fetchchatlist", callback)
  }, [])
  return (
    <div className="flex-1 flex mt-2 mb-[48px] flex-col overflow-y-auto">{
      groupList.map(([Date,list])=>{
        return (
          <div key={Date}>
            <div className="sticky top-0 z-10 p-3 text-sm bg-gray-900 text-gray-500">
              {Date}
            </div>
            <ul>
              {
                list.map((item)=>{
                  const selected = item.id === selectedChat ?.id 
                  return (
                  <li
                    onClick={(() =>
                      setselectedChat(()=>(selected ? undefined : item))
                    )}
                    key={item.id} className={`group rounded-md hover:bg-gray-800 flex items-center space-x-3 cursor-pointer p-3 ${
                      selected ? "bg-gray-800" : ""
                    }`}
                  >
                    <div>
                      <PiChatBold />
                    </div>
                    <div className="relative flex-1 whitespace-nowrap overflow-hidden">
                      {item.title}
                      <span className={`group-hover:from-gray-800 absolute right-0 inset-y-0 w-8 bg-gradient-to-l ${
                        selected ? "from-gray-800" : "from-gray-900"
                      }`}></span>
                    </div>

                  </li>)}
                )
              }
            </ul>
          </div>
        )
      })
    }
      
    </div>
  )
}