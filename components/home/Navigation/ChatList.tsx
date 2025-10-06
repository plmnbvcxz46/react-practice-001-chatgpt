import { useEffect, useMemo, useRef, useState } from "react"
import { Chat } from "@/types/chat"
import { groupByDate } from "@/common/util"
import ChatItem from "./ChatItem"
import { EventListener, useEventBusContext } from "@/components/EventBusContext"
import { useAppContext } from "@/components/AppContext"
import { ActionType } from "@/reducer/AppReducer"

export default function ChatList(){
  const [chatlist, setChatList] = useState<Chat[]>([])
  const pageRef = useRef(1)
  const {
    state: {selectedChat},
    dispatch
  } = useAppContext()
  const groupList = useMemo(()=>{
    return groupByDate(chatlist)
  },[chatlist])
  const {subscribe, unsubscribe} = useEventBusContext()

  const loadMoreRef = useRef(null)
  const hasMoreRef = useRef(false)
  const isLoadingRef = useRef(false)

  async function getData() {
    if(isLoadingRef.current){
      return
    }
    isLoadingRef.current = true
    const currentPage = pageRef.current
    const response = await fetch(`/api/chat/list?page=${currentPage}`, {
      method:"GET"
    })
    if(!response.ok){
      console.log(response.statusText)
      isLoadingRef.current = false
      return
    }
    const {data} = await response.json()
    hasMoreRef.current = data.hasMore
    
    if (currentPage === 1){
      setChatList(data.list)
    }else {
      setChatList((list)=> list.concat(data.list))
    }

    pageRef.current++
    isLoadingRef.current = false
  }
  useEffect(()=>{
    getData()
  },[])
  useEffect(() => {
    const callback: EventListener = () => {
      pageRef.current = 1
      setChatList([])
      getData()
    }
    subscribe("fetchchatlist", callback)
    return () => unsubscribe("fetchchatlist", callback)
  }, [])

  useEffect(()=>{
    let observer: IntersectionObserver | null = null
    let div = loadMoreRef.current
    if(div){
      observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && hasMoreRef.current){
          console.log("visible")
          getData()
        }
      })
      observer.observe(div)
    }
    return () => {
      if(observer && div) {
        
        observer.unobserve(div)
      }
    }
  },[])

  return (
    <div className="flex-1 flex mt-2 mb-[48px] flex-col overflow-y-auto">{
      groupList.map(([Date,list])=>{
        return (
          <div key={Date}>
            <div className="sticky top-0 z-10 p-3 text-sm bg-gray-900 text-gray-500 overflow-hidden text-ellipsis">
              {Date}
            </div>
            <ul>
              {
                list.map((item)=>{
                  const selected = item.id === selectedChat?.id 
                  return (
                    <ChatItem
                      key={item.id}
                      item={item}
                      selected={selected}
                      onSelected={(chat) => {
                        dispatch({
                          type: ActionType.UPDATE,
                          field: "selectedChat",
                          value: chat
                        })
                      }}
                    />
                  )}
                )
              }
            </ul>
          </div>
        )
      })
    }
    <div ref={loadMoreRef}>&nbsp;</div>
    </div>
  )
}