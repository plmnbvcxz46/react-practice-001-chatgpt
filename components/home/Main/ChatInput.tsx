import { useAppContext } from "@/components/AppContext";
import Button from "@/components/common/Button";
import { useEventBusContext } from "@/components/EventBusContext";
import { ActionType } from "@/reducer/AppReducer";
import { Message, MessageRequestBody } from "@/types/chat";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { MdRefresh } from "react-icons/md";
import { PiLightningFill, PiStopBold } from "react-icons/pi";
import TestareaAutoSize from "react-textarea-autosize";
export default function ChatInput() {
  const [messageText, setMessageText] = useState("")
  const stopRef = useRef(false)
  const chatIdRef = useRef("")
  const {
    state: {messageList, currentModel, streamingId, selectedChat}, 
    dispatch
  } = useAppContext()

  const {publish, subscribe, unsubscribe} = useEventBusContext()


  useEffect(() => {
    if(chatIdRef.current === selectedChat?.id) {
      return
    }
    chatIdRef.current = selectedChat?.id ?? ""
    stopRef.current = true
  }, [selectedChat])

  useEffect(() => {
    const handleNewChatWithPrompt = async (prompt: string) => {
      console.log("=== Example 按钮点击 ===, prompt:", prompt.substring(0, 50))
      
      // 清空当前聊天ID,创建新对话
      chatIdRef.current = ""
      dispatch({type: ActionType.UPDATE, field: "messageList", value: []})
      dispatch({type: ActionType.UPDATE, field: "selectedChat", value: null})
      // 设置prompt文本
      setMessageText(prompt)
      
      // 等待状态更新
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 1. 创建用户消息
      const response = await fetch("/api/message/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: "",
          role: "user",
          content: prompt,
          chatId: chatIdRef.current
        })
      })
      
      if (!response.ok) {
        console.log("创建消息失败:", response.statusText)
        return
      }
      
      const { data } = await response.json()
      if(!data?.message){
        console.log("message payload missing")
        return
      }
      
      const message = data.message
      
      // 更新 chatIdRef
      if(!chatIdRef.current){
        chatIdRef.current = message.chatId
        console.log("新对话创建, chatId:", chatIdRef.current)
        publish("fetchchatlist")
        // 获取完整的聊天对象(包含title)
        const chatResponse = await fetch(`/api/chat/list?page=1`)
        if(chatResponse.ok) {
          const { data: chatData } = await chatResponse.json()
          const newChat = chatData.list.find((c: any) => c.id === chatIdRef.current)
          if(newChat) {
            dispatch({
              type: ActionType.UPDATE,
              field: "selectedChat",
              value: newChat
            })
          }
        }
      }
      
      console.log("消息创建成功, chatId:", chatIdRef.current)
      dispatch({type: ActionType.ADD_MESSAGE, message})
      
      // 2. 生成标题 - 使用更新后的 chatIdRef.current
      console.log("开始生成标题, chatId:", chatIdRef.current)
      await generateChatTitle(prompt, chatIdRef.current)
      
      console.log("标题生成完成")
      
      // 3. 再发送对话内容
      const messages = [message]
      doSend(messages)
    }
    
    subscribe("newChatWithPrompt", handleNewChatWithPrompt)
    
    return () => {
      unsubscribe("newChatWithPrompt", handleNewChatWithPrompt)
    }
  }, [subscribe, unsubscribe, dispatch, publish, currentModel])

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
    if(!data?.message){
      console.log("message payload missing")
      return
    }
    if(!chatIdRef.current){
      chatIdRef.current = data.message.chatId
      publish("fetchchatlist")
      // 获取完整的聊天对象（包含title）
      const chatResponse = await fetch(`/api/chat/list?page=1`)
      if(chatResponse.ok) {
        const { data: chatData } = await chatResponse.json()
        const newChat = chatData.list.find((c: any) => c.id === chatIdRef.current)
        if(newChat) {
          dispatch({
            type: ActionType.UPDATE,
            field: "selectedChat",
            value: newChat
          })
        }
      }
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
  
  async function sendWithPrompt(prompt: string){
    const message = await createOrUpdateMessage({
      id: "",
      role: "user",
      content: prompt,
      chatId: chatIdRef.current
    })
    if(!message){
      return
    }
    dispatch({type: ActionType.ADD_MESSAGE, message})
    const messages = [message]
    
    // 先生成标题，再发送对话内容
    console.log("sendWithPrompt - 开始生成标题, chatId:", chatIdRef.current)
    await generateChatTitle(message.content, chatIdRef.current)
    
    // 标题生成完成后再发送对话内容
    doSend(messages)
  }
  
  async function send(){
    const message = await createOrUpdateMessage({
      id: "",
      role: "user",
      content: messageText,
      chatId: chatIdRef.current
    })
    if(!message){
      return
    }
    dispatch({type: ActionType.ADD_MESSAGE, message})
    const messages = messageList.concat([message])
    
    // 只在发送第一条消息时生成标题
    if(messageList.length === 0) {
      console.log("send - 开始生成标题, chatId:", chatIdRef.current)
      await generateChatTitle(message.content, chatIdRef.current)
    }
    
    // 标题生成完成后（或非首条消息时）再发送对话内容
    doSend(messages)
  }
  
  async function generateChatTitle(userMessage: string, chatId: string) {
    try {
      console.log("开始生成标题，chatId:", chatId, "用户消息:", userMessage.substring(0, 50))
      
      const body: MessageRequestBody = {
        messages: [{
          id: "",
          role: "user",
          content: 
            `请为以下对话生成一个简短的标题。要求：
              1. 只返回标题文本，不要有任何解释或其他内容
              2. 标题长度控制在 5-10 个字
              3. 不要使用标点符号、引号、语气词
              4. 直接概括对话的核心主题
              5. 如果无法概括主题，返回"新对话"

            对话内容：
            ${userMessage}

            标题：`,
          chatId: ""
        }],
        model: currentModel
      }
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
      
      if (!response.ok || !response.body) {
        console.log("生成标题失败")
        return
      }
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let title = ""
      
      while (!done) {
        const result = await reader.read()
        done = result.done
        const chunk = decoder.decode(result.value)
        title += chunk
      }
      
      console.log("生成的标题:", title.trim())
      
      // 更新聊天标题
      if(title.trim()) {
        const updateResponse = await fetch("/api/chat/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: chatId,
            title: title.trim()
          })
        })
        
        if(updateResponse.ok) {
          console.log("标题更新成功")
          // 更新本地状态
          publish("fetchchatlist")
        } else {
          console.log("标题更新失败:", updateResponse.statusText)
        }
      }
    } catch (error) {
      console.error("生成标题出错:", error)
    }
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
    stopRef.current = false
    const body: MessageRequestBody = {messages, model: currentModel}
    setMessageText("")
    
    // 打印多轮对话日志
    console.log("发送多轮对话，消息数量:", messages.length)
    console.log("对话历史:", messages.map(m => `${m.role}: ${m.content.substring(0, 30)}...`))
    
    // 设置等待响应状态
    dispatch({
      type: ActionType.UPDATE,
      field: "isWaitingResponse",
      value: true
    })
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
    if(!responseMessage){
      controller.abort()
      return
    }
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
    let buffer = "" // 用于缓存接收到的字符
    while (!done) {
      if(stopRef.current) {
        controller.abort()
        break
      }
      const result = await reader.read()
      done = result.done
      const chunk = decoder.decode(result.value)
      buffer += chunk
      
      // 当收到第一个字符时，关闭等待状态
      if (buffer.length > 0) {
        dispatch({
          type: ActionType.UPDATE,
          field: "isWaitingResponse",
          value: false
        })
      }
      
      // 每次取出2-3个字符进行显示
      while (buffer.length > 0) {
        const chunkSize = 1
        const displayChunk = buffer.substring(0, chunkSize)
        buffer = buffer.substring(chunkSize)
        content += displayChunk
        
        dispatch({type: ActionType.UPDATE_MESSAGE,
          message: {...responseMessage, content}
        })
        
        // 添加小延迟，让显示更流畅
        if (buffer.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 30))
        }
      }
    }
    createOrUpdateMessage({
      ...responseMessage, content
    })
    dispatch({
      type:ActionType.UPDATE,
      field:"streamingId", 
      value: ""
    })
    dispatch({
      type: ActionType.UPDATE,
      field: "isWaitingResponse",
      value: false
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