"use client"

import { type Action, type State, reducer, initState } from "@/reducer/AppReducer"
import { Dispatch, ReactNode, createContext, useContext, useMemo, useReducer } from "react"

type AppContextProps = {
  state: State
  dispatch: Dispatch<Action>
}

const AppContext = createContext<AppContextProps>(null!)

export function useAppContext() {
  return useContext(AppContext)
}

export default function AppContextProvider({
  children
} : {
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(reducer, initState)
  const contextValue = useMemo<AppContextProps>(() => {
    return { state, dispatch }
  }, [state])
  return <AppContext.Provider value={contextValue}>
    {children}
  </AppContext.Provider>
}