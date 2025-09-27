import ChatInput from "./ChatInput"
import ChatList from "./ChatList"
import Example from "./Example"
import Menu from "./Menu"
import { Welcome } from "./Welcome"

export default function Main(){
  return (
    <div className="flex relative w-full h-full">
      <main className="overflow-y-auto w-full h-full text-gray-900  bg-white  dark:text-gray-100 dark:bg-gray-800">
        <Menu />
        {/* <Welcome /> */}
        <ChatList />
        <ChatInput />
      </main>
    </div>
  )
}