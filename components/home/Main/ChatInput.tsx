import { useAppContext } from "@/components/AppContext";
import Button from "@/components/common/Button";
import { ActionType } from "@/reducer/AppReducer";
import { Message, MessageRequestBody } from "@/types/chat";
import { useReducer, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { MdRefresh } from "react-icons/md";
import { PiLightningFill, PiStopBold, PiStopThin } from "react-icons/pi";
import TestareaAutoSize from "react-textarea-autosize";
import { v4 as uuidv4 } from "uuid";
export default function ChatInput() {
  const [messageText, setMessageText] = useState("")
  const stopRef = useRef(false)
  const chatIdRef = useRef("")
  const {
    state: {messageList, currentModel, streamingId}, dispatch
  } = useAppContext()

  async function createOrUpdateMessage(message:Message) {
    const response = await fetch("/api/message/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    const { data } = await response.json()
    if(!chatIdRef.current){
      chatIdRef.current = data.message.chatId
    }
    return data.message
    
  }
  async function deleteMessage(id: string) {
    const response = await fetch(`/api/message/delete?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    const { code } = await response.json()
    return code === 0
    
  }
  async function send(){
    const message = await createOrUpdateMessage({
      id: "",
      role: "user",
      content: messageText,
      chatId: chatIdRef.current
    })
    dispatch({type: ActionType.ADD_MESSAGE, message})
    const messages = messageList.concat([message])
    doSend(messages)
  }
  async function resend() {
    const messages = [...messageList]
    if(
      messages.length !== 0 && messages[messages.length-1].role === "assistant"
    ){
      const result = await deleteMessage(messages[messages.length-1].id)
      if(!result){
        console.log("delete error")
        return 
      }
      dispatch({
        type: ActionType.REMOVE_MESSAGE,
        message: messages[messages.length -1 ]
      })
      messages.splice(messages.length -1 , 1)
      
      doSend(messages)
    }
    
  }
  async function doSend(messages: Message[]) {
    
    const body: MessageRequestBody = {messages, model: currentModel}
    setMessageText("")
    const controller = new AbortController()
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller.signal, 
      body: JSON.stringify(body)
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    if (!response.body) {
      console.log("body error")
      return
    }
    const responseMessage:Message = await createOrUpdateMessage({
      id: "",
      role: "assistant",
      content: "",
      chatId: chatIdRef.current
    })
    dispatch({type: ActionType.ADD_MESSAGE, message: responseMessage})
    dispatch({
      type:ActionType.UPDATE,
      field:"streamingId", 
      value: responseMessage.id
    })
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let done = false
    let content = ""
    while (!done) {
      if(stopRef.current) {
        stopRef.current = false
        controller.abort()
        break
      }
      const result = await reader.read()
      done = result.done
      const chunk = decoder.decode(result.value)
      console.log(chunk)
      content += chunk
      dispatch( {type: ActionType.UPDATE_MESSAGE,
         message: {...responseMessage, content}
        })
    }
    createOrUpdateMessage({
      ...responseMessage, content
    })
    dispatch({
      type:ActionType.UPDATE,
      field:"streamingId", 
      value: ""
    })
  }
  return (
    <div
      className="
        absolute bottom-0 inset-x-0 
        pt-10
        !bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.99)_80%)]
        dark:!bg-[linear-gradient(180deg,rgba(31,41,55,0)_0%,rgba(31,41,55,0.98)_80%)]
      "
    >
      <div className="w-full mx-auto flex max-w-4xl flex-col items-center space-y-4 p-4">
        {
          messageList.length !== 0 && (
            streamingId === "" ?(
          <Button
            icon={MdRefresh}
            variant="primary"
            onClick={resend}
            className="font-medium bg-[#26cf8e] hover:bg-[#1b9969]"
          >
            重新生成
          </Button>
          ) : 
          <Button
            icon={PiStopBold}
            variant="primary"
            onClick={()=>{
              stopRef.current = true
            }}
            className="font-medium bg-[#26cf8e] hover:bg-[#1b9969]"
          >
            停止生成
          </Button>
        )}

        <div className="flex items-end w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-4">
          <div className={`mx-3 mb-2.5 dark:text-gray-300 text-[#26cf8e]`}>
            <PiLightningFill />
          </div>
          <TestareaAutoSize
            className={"flex-1 outline-none max-h-64 mb-1.5 bg-transparent text-black dark:text-white resize-none border-0 "}
            placeholder="输入一条消息"
            rows={1}
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value)
            }}
          />
            <Button
              className={`mx-3 !rounded-lg bg-[#26cf8e] disabled:bg-gray-300`}
              icon={FiSend}
              variant="primary"
              onClick={send}
              disabled = { messageText.trim() === "" || streamingId != ""}
            />
        </div>
        <footer className="text-center text-sm text-gray-700 dark:text-gray-300 px-4 pb-6">
          @{new Date().getFullYear()}&nbsp;: <a 
            className="font-medium py-[1px] border-b border-black/60 hover:border-black/0 dark:border-gray-200 dark:hover:border-gray-200/0 animated-underlined"
            href="https://cnt.bing.com" target="_blank" rel="noopener noreferrer">网址</a>
          .&nbsp;基于第三方接口
        </footer>
      </div>
    </div>
  );
}