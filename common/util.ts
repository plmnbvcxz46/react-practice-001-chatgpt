import { Chat } from "@/types/chat"
import { resolve } from "path"

export function groupByDate(chatList: Chat[]) {
    const groupMap = new Map<string, Chat[]>()
    chatList.forEach((item) => {
        const now = new Date()
        const updateTime = new Date(item.updateTime)
        let key = "未知时间"
        const dayDiff = Math.floor(
            (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (dayDiff === 0 && now.getDate() === updateTime.getDate()) {
            key = "今天"
        } else if (dayDiff <= 7) {
            key = "最近7天"
        } else if (dayDiff <= 31) {
            key = "最近一个月"
        } else if (now.getFullYear() === updateTime.getFullYear()) {
            key = `${updateTime.getMonth() + 1}月`
        } else {
            key = `${updateTime.getFullYear()}`
        }
        if (groupMap.has(key)) {
            groupMap.get(key)?.push(item)
        } else {
            groupMap.set(key, [item])
        }
    })
    groupMap.forEach((item) => {
        item.sort((a, b) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime())
    })
    const groupList = Array.from(groupMap).sort(([, list1], [, list2]) => {
        return (
            new Date(list1[list1.length - 1].updateTime).getTime() -
            new Date(list2[list2.length - 1].updateTime).getTime()
        )
    })
    return groupList
}

export function sleep(time: number){
    return new Promise((resolve)=>{
        setTimeout(() => {
            resolve('time is up')
        }, time)
    })
}