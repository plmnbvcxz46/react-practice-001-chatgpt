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

// OpenRouter 模型信息类型定义
export interface OpenRouterModel {
  id: string
  name: string
  description: string
  context_length: number
  pricing: {
    prompt: string
    completion: string
  }
  architecture: {
    input_modalities: string[]
    output_modalities: string[]
  }
  top_provider: {
    max_completion_tokens: number
    is_moderated: boolean
  }
}