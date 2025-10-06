import { Message } from "@/types/chat"
import { PiOpenAiLogo } from "react-icons/pi"
import Markdown from "@/components/common/Markdown"
import { useAppContext } from "@/components/AppContext"
import { ActionType } from "@/reducer/AppReducer"
import { useEffect, useState } from "react"

export default function ChatList () {
	const {
		state: {messageList, streamingId, selectedChat, isWaitingResponse},
		dispatch
	} = useAppContext()
	
	// 闪烁光标效果
	const [showCursor, setShowCursor] = useState(true)
	
	useEffect(() => {
		if (isWaitingResponse) {
			const interval = setInterval(() => {
				setShowCursor(prev => !prev)
			}, 500) // 每500ms切换一次
			
			return () => clearInterval(interval)
		} else {
			setShowCursor(true)
		}
	}, [isWaitingResponse])

	async function getData(chatId: string) {
		const response = await fetch(`/api/message/list?chatId=${chatId}`, {
			method: "GET"
		})
		if (!response.ok) {
			console.log(response.statusText)
			return
		}
		const { data } = await response.json()
		dispatch({
			type: ActionType.UPDATE,
			field: "messageList",
			value: data?.list ?? []
		})
	}

	useEffect(()=>{
		if(selectedChat){
			getData(selectedChat.id)
		} else {
			dispatch({
				type: ActionType.UPDATE,
				field: "messageList",
				value: []
			})
		}
	}, [selectedChat])

	return (<div className="w-full pt-10 pb-60 dark:text-gray-300">
    <ul>
        {
					messageList.map((item: Message)=>{
						const isUser = item.role === "user" ? true : false
						return <li key = {item.id} className={`
							${isUser ? 
								"bg-white dark:bg-gray-800"
								: "bg-gray-100 dark:bg-gray-700"
							}
						`}>
							<div className="w-full  max-w-7xl mx-auto flex space-x-10 px-6 py-6 text-lg">
									<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-5xl leading-[1]">
											{
												isUser? "🙂" : <PiOpenAiLogo />
											}
									</div>
								<div className="flex-1 min-w-0">
										<Markdown className="markdown break-words whitespace-pre-wrap">
											{`${item.content}${streamingId === item.id ? "▍" : ""}`}
										</Markdown>
									</div>
								</div>
						</li>
					})
        }
				{/* 等待响应时显示闪烁的 assistant 占位符 */}
				{isWaitingResponse && (
					<li className="bg-gray-100 dark:bg-gray-700">
						<div className="w-full max-w-7xl mx-auto flex space-x-10 px-6 py-6 text-lg">
							<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-5xl leading-[1]">
								<PiOpenAiLogo />
							</div>
							<div className="flex-1 min-w-0">
								<Markdown className="markdown break-words whitespace-pre-wrap">
									{showCursor ? "▍" : ""}
								</Markdown>
							</div>
						</div>
					</li>
				)}
    </ul>
  </div>)
}