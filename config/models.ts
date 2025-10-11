// OpenRouter 免费模型配置
// 数据来源: https://openrouter.ai/api/v1/models
// 更新时间: 2025-10-11

export interface ModelConfig {
  id: string;
  name: string;
  description?: string;
}

// 所有 51 个免费模型
export const FREE_MODELS: ModelConfig[] = [
  { id: "alibaba/tongyi-deepresearch-30b-a3b:free", name: "Tongyi DeepResearch 30B" },
  { id: "meituan/longcat-flash-chat:free", name: "LongCat Flash Chat" },
  { id: "nvidia/nemotron-nano-9b-v2:free", name: "Nemotron Nano 9B V2" },
  { id: "deepseek/deepseek-chat-v3.1:free", name: "DeepSeek V3.1" },
  { id: "openai/gpt-oss-20b:free", name: "GPT-OSS 20B" },
  { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air" },
  { id: "qwen/qwen3-coder:free", name: "Qwen3 Coder 480B" },
  { id: "moonshotai/kimi-k2:free", name: "Kimi K2" },
  { id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free", name: "Venice Uncensored 24B" },
  { id: "google/gemma-3n-e2b-it:free", name: "Gemma 3n 2B" },
  { id: "tencent/hunyuan-a13b-instruct:free", name: "Hunyuan A13B" },
  { id: "tngtech/deepseek-r1t2-chimera:free", name: "DeepSeek R1T2 Chimera" },
  { id: "mistralai/mistral-small-3.2-24b-instruct:free", name: "Mistral Small 3.2 24B" },
  { id: "moonshotai/kimi-dev-72b:free", name: "Kimi Dev 72B" },
  { id: "deepseek/deepseek-r1-0528-qwen3-8b:free", name: "DeepSeek R1 Qwen3 8B" },
  { id: "deepseek/deepseek-r1-0528:free", name: "DeepSeek R1 0528" },
  { id: "mistralai/devstral-small-2505:free", name: "Devstral Small 2505" },
  { id: "google/gemma-3n-e4b-it:free", name: "Gemma 3n 4B" },
  { id: "meta-llama/llama-3.3-8b-instruct:free", name: "Llama 3.3 8B" },
  { id: "qwen/qwen3-4b:free", name: "Qwen3 4B" },
  { id: "qwen/qwen3-30b-a3b:free", name: "Qwen3 30B" },
  { id: "qwen/qwen3-8b:free", name: "Qwen3 8B" },
  { id: "qwen/qwen3-14b:free", name: "Qwen3 14B" },
  { id: "qwen/qwen3-235b-a22b:free", name: "Qwen3 235B" },
  { id: "tngtech/deepseek-r1t-chimera:free", name: "DeepSeek R1T Chimera" },
  { id: "microsoft/mai-ds-r1:free", name: "Microsoft MAI DS R1" },
  { id: "shisa-ai/shisa-v2-llama3.3-70b:free", name: "Shisa V2 Llama 70B" },
  { id: "arliai/qwq-32b-arliai-rpr-v1:free", name: "QwQ 32B RpR v1" },
  { id: "agentica-org/deepcoder-14b-preview:free", name: "Deepcoder 14B" },
  { id: "meta-llama/llama-4-maverick:free", name: "Llama 4 Maverick" },
  { id: "meta-llama/llama-4-scout:free", name: "Llama 4 Scout" },
  { id: "qwen/qwen2.5-vl-32b-instruct:free", name: "Qwen2.5 VL 32B" },
  { id: "deepseek/deepseek-chat-v3-0324:free", name: "DeepSeek V3 0324" },
  { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "Mistral Small 3.1 24B" },
  { id: "google/gemma-3-4b-it:free", name: "Gemma 3 4B" },
  { id: "google/gemma-3-12b-it:free", name: "Gemma 3 12B" },
  { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B" },
  { id: "nousresearch/deephermes-3-llama-3-8b-preview:free", name: "DeepHermes 3 8B" },
  { id: "cognitivecomputations/dolphin3.0-mistral-24b:free", name: "Dolphin 3.0 24B" },
  { id: "qwen/qwen2.5-vl-72b-instruct:free", name: "Qwen2.5 VL 72B" },
  { id: "mistralai/mistral-small-24b-instruct-2501:free", name: "Mistral Small 3" },
  { id: "deepseek/deepseek-r1-distill-llama-70b:free", name: "DeepSeek R1 Distill 70B" },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1" },
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B" },
  { id: "qwen/qwen-2.5-coder-32b-instruct:free", name: "Qwen2.5 Coder 32B" },
  { id: "meta-llama/llama-3.2-3b-instruct:free", name: "Llama 3.2 3B" },
  { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen2.5 72B" },
  { id: "mistralai/mistral-nemo:free", name: "Mistral Nemo" },
  { id: "google/gemma-2-9b-it:free", name: "Gemma 2 9B" },
  { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B" },
];

// 推荐的热门模型（用于默认显示）
export const FEATURED_FREE_MODELS: ModelConfig[] = [
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash" },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B" },
  { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen2.5 72B" },
  { id: "deepseek/deepseek-chat-v3.1:free", name: "DeepSeek V3.1" },
  { id: "mistralai/mistral-small-3.2-24b-instruct:free", name: "Mistral Small 3.2" },
];
