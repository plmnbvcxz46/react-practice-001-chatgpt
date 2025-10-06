import Example from "./Example";
import ModelSelect from "./ModelSlect";

export function Welcome(){
  return <div className="flex flex-col w-full max-w-4xl mx-auto px-4 pt-8 pb-8 items-center">
    <ModelSelect />
    <h1 className="mt-20 text-4xl font-bold">
      Welcome to use the Ai model!
    </h1>
    <Example />
  </div>
}