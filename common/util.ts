import { Chat } from "@/types/chat"

export function groupByDate(chatList: Chat[]) {
    const sortedList = [...chatList].sort(
        (a, b) =>
            new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
    )
    const groupMap = new Map<string, Chat[]>()
    const now = new Date()
    sortedList.forEach((item) => {
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
        const list = groupMap.get(key)
        if (list) {
            list.push(item)
        } else {
            groupMap.set(key, [item])
        }
    })
    return Array.from(groupMap.entries())
}

export function sleep(time: number){
    return new Promise((resolve)=>{
        setTimeout(() => {
            resolve('time is up')
        }, time)
    })
}