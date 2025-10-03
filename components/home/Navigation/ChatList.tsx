import { useEffect, useMemo, useRef, useState } from "react"
import { Chat } from "@/types/chat"
import { AiOutlineEdit } from "react-icons/ai"
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md"
import { PiChatBold, PiTrashBold } from "react-icons/pi"
import { groupByDate } from "@/common/util"
import { useEventBusContext } from "@/components/EventBusContext"

export default function ChatList(){
  const [chatlist, setChatList] = useState<Chat[]>([])
  const pageRef = useRef(1)
  const [selectedChat, setselectedChat] = useState<Chat | undefined>()
  const groupList = useMemo(()=>{
    return groupByDate(chatlist)
  },[chatlist])
  const {subscribe, unsubscribe} = useEventBusContext()
  async function getData() {
    const response = await fetch(`/api/chat/list?page=${pageRef.current}`, {
      method:"GET"
    })
    if(!response.ok){
      console.log(response.statusText)
      return
    }
    const {data} = await response.json()
    if (pageRef.current === 1){
      setChatList(data.list)
    }else {
      setChatList((list)=> list.concat(data.list))
    }
  }
  useEffect(()=>{
    getData()
  },[])
  useEffect(() => {
    const callback: EventListener = () => {
      pageRef.current =1
      getData()
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