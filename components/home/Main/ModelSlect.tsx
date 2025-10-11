import { useAppContext } from "@/components/AppContext"
import { ActionType } from "@/reducer/AppReducer"
import { OpenRouterModel } from "@/types/chat"
import { useEffect, useState } from "react"
import { PiRobotFill } from "react-icons/pi"

export default function ModelSelect() {
  const { state: { currentModel }, dispatch } = useAppContext()
  const [models, setModels] = useState<OpenRouterModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 通过 Next.js API 路由获取模型列表（避免 CORS 问题）
    fetch("/api/models")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }
        return res.json()
      })
      .then(data => {
        // 检查是否使用了后备模型
        if (data.isFallback) {
          console.warn("使用后备模型列表")
          setError("使用后备模型（网络问题）")
        }

        const modelList = data.data || []
        
        if (modelList.length === 0) {
          throw new Error("没有可用的模型")
        }

        console.log(`加载了 ${modelList.length} 个模型`)
        
        // 显示统计信息
        if (data.meta) {
          console.log(`模型统计 - 总数: ${data.meta.total}, 免费: ${data.meta.free}, 返回: ${data.meta.returned}`)
        }

        setModels(modelList)
        
        // 如果没有选中模型，默认选择第一个
        if (!currentModel && modelList.length > 0) {
          dispatch({
            type: ActionType.UPDATE,
            field: "currentModel",
            value: modelList[0].id
          })
        }
      })
      .catch(err => {
        console.error("获取模型列表失败:", err)
        setError(`加载失败: ${err.message}`)
        
        // 使用后备模型
        const fallbackModels: OpenRouterModel[] = [
          {
            id: "openai/gpt-4o-mini",
            name: "GPT-4o Mini",
            description: "Fast and affordable model",
            context_length: 128000,
            pricing: { prompt: "0.00000015", completion: "0.0000006" },
            architecture: { input_modalities: ["text"], output_modalities: ["text"] },
            top_provider: { max_completion_tokens: 16384, is_moderated: true }
          },
          {
            id: "google/gemini-2.0-flash-exp:free",
            name: "Gemini 2.0 Flash (free)",
            description: "Free experimental model",
            context_length: 1000000,
            pricing: { prompt: "0", completion: "0" },
            architecture: { input_modalities: ["text"], output_modalities: ["text"] },
            top_provider: { max_completion_tokens: 8192, is_moderated: false }
          },
        ];
        
        setModels(fallbackModels)
        
        if (!currentModel && fallbackModels.length > 0) {
          dispatch({
            type: ActionType.UPDATE,
            field: "currentModel",
            value: fallbackModels[0].id
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex bg-gray-200 dark:bg-gray-900 p-1 rounded-xl">
        <div className="text-gray-500 text-sm py-2.5 px-4">加载模型中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex bg-gray-200 dark:bg-gray-900 p-1 rounded-xl">
        <div className="text-red-500 text-sm py-2.5 px-4">加载失败: {error}</div>
      </div>
    )
  }

  if (models.length === 0) {
    return (
      <div className="flex bg-gray-200 dark:bg-gray-900 p-1 rounded-xl">
        <div className="text-gray-500 text-sm py-2.5 px-4">无可用模型</div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-xl p-3 shadow-inner">
      {/* 横向滚动容器 */}
      <div 
        className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2"
      >
        {models.map((item) => {
          const selected = item.id === currentModel
          // 提取模型简短名称
          const displayName = item.name
          
          return (
            <button 
              key={item.id} 
              onClick={() => {
                dispatch({
                  type: ActionType.UPDATE,
                  field: "currentModel",
                  value: item.id
                })
              }}
              title={`${item.name}\n${item.description || ''}\nID: ${item.id}`}
              className={`group flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border-2 ${
                selected 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105" 
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md hover:scale-102"
              }`}
            >
              <span className={`text-lg transition-transform duration-200 ${selected ? "scale-110" : "group-hover:scale-110"}`}>
                <div className={selected ? "text-white" : "text-emerald-500"} />
              </span>
              <span className="whitespace-nowrap font-semibold">{displayName}</span>
            </button>
          )
        })}
      </div>
      
      {/* 提示文本 */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
      </div>
    </div>
  )
}