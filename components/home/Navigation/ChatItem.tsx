import { useEffect, useState } from "react"
import { Chat } from "@/types/chat"
import { AiOutlineEdit } from "react-icons/ai"
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md"
import { PiChatBold, PiTrashBold } from "react-icons/pi"
import { useEventBusContext } from "@/components/EventBusContext"
import { useAppContext } from "@/components/AppContext"
import { ActionType } from "@/reducer/AppReducer"

type Props = {
  item: Chat
  selected: boolean
  onSelected: (chat: Chat) => void
}

export default function ChatItem({ item, selected, onSelected }: Props) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [title, setTitle] = useState(item.title)
  const {publish} = useEventBusContext()
  const {dispatch} = useAppContext()

  useEffect(() => {
    setEditing(false)
    setDeleting(false)
    setTitle(item.title)
  }, [selected, item.title])

  async function updateChat() {
    const response = await fetch("/api/chat/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({id: item.id, title: title})
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    const {code} = await response.json()
    if(code === 0){
      item.title = title
      publish("fetchchatlist")
    }
  }
  async function deleteChat() {
    const response = await fetch(`/api/chat/delete?id=${item.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    const {code} = await response.json()
    if(code === 0){
      publish("fetchchatlist")
      dispatch({
        type: ActionType.UPDATE, 
        field: "selectedChat",
        value: null
      })
    }
  }

  return (
    <li
      onClick={() => {
        onSelected(item)
      }}
      className={`relative group flex items-center p-3 space-x-3 cursor-pointer rounded-md hover:bg-gray-800 ${
        selected ? "bg-gray-800 pr-[3.5rem]" : ""
      }`}
    >
      <div>{deleting ? <PiTrashBold /> : <PiChatBold />}</div>
      <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
        {editing ? (
          <input
            autoFocus
            aria-label="编辑会话标题"
            placeholder="编辑会话标题"
            className="w-full bg-transparent outline-none"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />
        ) : (
          item.title
        )}
      </div>

      <span
        className={`group-hover:from-gray-800 absolute right-0 inset-y-0 w-8 bg-gradient-to-l pointer-events-none ${
          selected ? "from-gray-800" : "from-gray-900"
        }`}
      ></span>

      {selected && (
        <div className="absolute right-1 flex w-[3rem]">
          {editing || deleting ? (
            <>
              <button
                onClick={(e) => {
                  if (deleting) {
                    deleteChat()
                  } else {
                    updateChat()
                  }
                  setDeleting(false)
                  setEditing(false)
                  e.stopPropagation()
                }}
                className="p-1 hover:text-white"
                aria-label={deleting ? "确认删除会话" : "确认编辑会话"}
                title={deleting ? "确认删除会话" : "确认编辑会话"}
              >
                <MdCheck />
              </button>
              <button
                onClick={(e) => {
                  setDeleting(false)
                  setEditing(false)
                  e.stopPropagation()
                }}
                className="p-1 hover:text-white"
                aria-label="取消操作"
                title="取消操作"
              >
                <MdClose />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  setEditing(true)
                  e.stopPropagation()
                }}
                className="p-1 hover:text-white"
                aria-label="编辑会话"
                title="编辑会话"
              >
                <AiOutlineEdit />
              </button>
              <button
                onClick={(e) => {
                  setDeleting(true)
                  e.stopPropagation()
                }}
                className="p-1 hover:text-white"
                aria-label="删除会话"
                title="删除会话"
              >
                <MdDeleteOutline />
              </button>
            </>
          )}
        </div>
      )}
    </li>
  )
}
