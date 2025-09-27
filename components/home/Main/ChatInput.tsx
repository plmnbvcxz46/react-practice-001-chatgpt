import Button from "@/components/common/Button";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { MdRefresh } from "react-icons/md";
import { PiLightningFill } from "react-icons/pi";
import TestareaAutoSize from "react-textarea-autosize";
import POST from "@/app/api/chat";
export default function ChatInput() {
  const [messageText, setMessageText] = useState ("")
  async function send() {
    const body = JSON.stringify(messageText)
    const response = await fetch("/api/chat", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      },
      body
    })
    if(!response.ok){
      console.log(response.statusText)
      return
    }
    if(!body){
      console.log("body error")
      return
    }
    const reader = response.body?.getReader()
    let done = false
    let decoder = new TextDecoder()
    while(!done){
      const result = await reader?.read()
      if(!result){
        return
      }
      done = result.done
      const chunk =decoder.decode(result?.value)
      console.log(chunk)
    }
    setMessageText("")
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
        <Button
          icon={MdRefresh}
          variant="primary"
          className="font-medium bg-gray-50 dark:bg-gray-600 !text-gray-400 dark:!text-gray-200"
        >
          重新生成
        </Button>

        <div className="flex items-end w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-4">
          <div className="mx-3 mb-2.5 text-gray-500 dark:text-gray-300">
            <PiLightningFill />
          </div>
          <TestareaAutoSize
            className="flex-1 outline-none max-h-64 mb-1.5 bg-transparent text-black dark:text-white resize-none border-0"
            placeholder="输入一条消息"
            rows={1}
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value)
            }}
          />
            <Button
              className="mx-3 !rounded-lg !text-gray-400 dark:!text-gray-300"
              icon={FiSend}
              variant="primary"
              onClick={send}
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