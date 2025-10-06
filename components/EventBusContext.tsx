"use client"

import {
    Dispatch,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
    useState
} from "react"

export type EventListener = (data?: any) => void

type EventBusContextProps = {
    subscribe: (event: string, callback: EventListener) => void
    unsubscribe: (event: string, callback: EventListener) => void
    publish: (event: string, data?: any) => void
}

const EventBusContext = createContext<EventBusContextProps>(null!)

export function useEventBusContext() {
    return useContext(EventBusContext)
}

export default function EventBusContextProvider({
    children
}: {
    children: ReactNode
}) {
    const [listeners, setListeners] = useState<Record<string, EventListener[]>>(
        {}
    )

    const subscribe = useCallback(
        (event: string, callback: EventListener) => {
            setListeners((prevListeners) => {
                const newListeners = { ...prevListeners }
                if (!newListeners[event]) {
                    newListeners[event] = []
                }
                newListeners[event].push(callback)
                return newListeners
            })
        },
        []
    )

    const unsubscribe = useCallback(
        (event: string, callback: EventListener) => {
            setListeners((prevListeners) => {
                if (prevListeners[event]) {
                    const newListeners = { ...prevListeners }
                    newListeners[event] = newListeners[event].filter(
                        (cb) => cb !== callback
                    )
                    return newListeners
                }
                return prevListeners
            })
        },
        []
    )

    const publish = useCallback(
        (event: string, data?: any) => {
            setListeners((prevListeners) => {
                if (prevListeners[event]) {
                    prevListeners[event].forEach((callback) => callback(data))
                }
                return prevListeners
            })
        },
        []
    )

    const contextValue = useMemo(() => {
        return { subscribe, unsubscribe, publish }
    }, [subscribe, unsubscribe, publish])

    return (
        <EventBusContext.Provider value={contextValue}>
            {children}
        </EventBusContext.Provider>
    )
}
