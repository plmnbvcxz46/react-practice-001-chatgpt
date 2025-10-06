export interface Chat{
  id: string
  title: string
  updateTime: Date
}

export interface Message{
  id: string
  role: "user" | "assistant"
  content: string
  chatId: string
}

export interface MessageRequestBody {
  messages: Message[]
  model: string
}

// Gemini 多轮对话格式的类型定义
export interface GeminiPart {
  text: string
}

export interface GeminiContent {
  role: "user" | "model"
  parts: GeminiPart[]
}