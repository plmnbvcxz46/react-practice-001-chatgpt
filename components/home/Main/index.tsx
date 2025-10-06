import { useAppContext } from "@/components/AppContext"
import ChatInput from "./ChatInput"
import ChatList from "./ChatList"
import Menu from "./Menu"
import { Welcome } from "./Welcome"

export default function Main(){
  const { state } = useAppContext()
  return (
    <div className="flex relative w-full h-full">
      <main className="overflow-y-auto w-full h-full text-gray-900  bg-white  dark:text-gray-100 dark:bg-gray-800">
        <Menu />
        { !state.selectedChat && <Welcome />}
        <ChatList />
        <ChatInput />
      </main>
    </div>
  )
}