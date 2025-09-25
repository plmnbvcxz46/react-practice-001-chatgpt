import Example from "./Example"
import Menu from "./Menu"
import { Welcome } from "./Welcome"

export default function Main(){
  return (
      <main className="overflow-y-auto relative flex-1 flex flex-col text-gray-900  bg-white  dark:text-gray-100 dark:bg-gray-800">
        <Menu />
        <Welcome />
        <Example />
      </main>
  )
}