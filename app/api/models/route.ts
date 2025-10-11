import { NextRequest, NextResponse } from "next/server";
import { FREE_MODELS } from "@/config/models";

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  architecture: {
    input_modalities: string[];
    output_modalities: string[];
  };
  top_provider: {
    max_completion_tokens: number;
    is_moderated: boolean;
  };
}

export interface ModelsResponse {
  data: OpenRouterModel[];
}

export async function GET(request: NextRequest) {
  try {
    console.log('使用本地免费模型配置...');
    
    // 使用本地配置的免费模型列表，避免网络请求问题
    const freeModelsData: OpenRouterModel[] = FREE_MODELS.map(model => ({
      id: model.id,
      name: model.name,
      description: model.description || "Free model from OpenRouter",
      context_length: 32768,
      pricing: { prompt: "0", completion: "0" },
      architecture: { input_modalities: ["text"], output_modalities: ["text"] },
      top_provider: { max_completion_tokens: 4096, is_moderated: false }
    }));

    console.log(`返回 ${freeModelsData.length} 个免费模型`);

    return NextResponse.json({
      data: freeModelsData,
      meta: {
        total: freeModelsData.length,
        free: freeModelsData.length,
        returned: freeModelsData.length,
      },
      source: "local-config"
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    console.error("获取模型列表错误:", errorMessage, error);
    
    // 返回一个精选的模型列表，确保前端有可用的模型
    // 这些模型在 OpenRouter 上都是可用的
    const fallbackModels: OpenRouterModel[] = [
      {
        id: "openai/gpt-4o-mini",
        name: "GPT-4o Mini",
        description: "Fast and affordable GPT-4 class model",
        context_length: 128000,
        pricing: { prompt: "0.00000015", completion: "0.0000006" },
        architecture: { input_modalities: ["text"], output_modalities: ["text"] },
        top_provider: { max_completion_tokens: 16384, is_moderated: true }
      },
      {
        id: "google/gemini-2.0-flash-exp:free",
        name: "Gemini 2.0 Flash (Free)",
        description: "Google's experimental free model",
        context_length: 1000000,
        pricing: { prompt: "0", completion: "0" },
        architecture: { input_modalities: ["text"], output_modalities: ["text"] },
        top_provider: { max_completion_tokens: 8192, is_moderated: false }
      },
      {
        id: "google/gemini-flash-1.5:free",
        name: "Gemini 1.5 Flash (Free)",
        description: "Fast and versatile multimodal model",
        context_length: 1000000,
        pricing: { prompt: "0", completion: "0" },
        architecture: { input_modalities: ["text", "image"], output_modalities: ["text"] },
        top_provider: { max_completion_tokens: 8192, is_moderated: false }
      },
      {
        id: "meta-llama/llama-3.2-3b-instruct:free",
        name: "Llama 3.2 3B (Free)",
        description: "Meta's efficient small model",
        context_length: 131072,
        pricing: { prompt: "0", completion: "0" },
        architecture: { input_modalities: ["text"], output_modalities: ["text"] },
        top_provider: { max_completion_tokens: 4096, is_moderated: false }
      },
      {
        id: "mistralai/mistral-7b-instruct:free",
        name: "Mistral 7B (Free)",
        description: "Efficient 7B parameter model",
        context_length: 32768,
        pricing: { prompt: "0", completion: "0" },
        architecture: { input_modalities: ["text"], output_modalities: ["text"] },
        top_provider: { max_completion_tokens: 4096, is_moderated: false }
      },
      {
        id: "anthropic/claude-3.5-sonnet",
        name: "Claude 3.5 Sonnet",
        description: "Most intelligent Claude model",
        context_length: 200000,
        pricing: { prompt: "0.000003", completion: "0.000015" },
        architecture: { input_modalities: ["text", "image"], output_modalities: ["text"] },
        top_provider: { max_completion_tokens: 8192, is_moderated: true }
      },
      {
        id: "openai/gpt-4o",
        name: "GPT-4o",
        description: "OpenAI's most capable model",
        context_length: 128000,
        pricing: { prompt: "0.0000025", completion: "0.00001" },
        architecture: { input_modalities: ["text", "image"], output_modalities: ["text"] },
        top_provider: { max_completion_tokens: 16384, is_moderated: true }
      },
      {
        id: "x-ai/grok-beta",
        name: "Grok Beta",
        description: "xAI's conversational model",
        context_length: 131072,
        pricing: { prompt: "0.000005", completion: "0.000015" },
        architecture: { input_modalities: ["text"], output_modalities: ["text"] },
        top_provider: { max_completion_tokens: 4096, is_moderated: false }
      },
      {
        id: "qwen/qwen-2.5-72b-instruct:free",
        name: "Qwen 2.5 72B (Free)",
        description: "Alibaba's powerful free model",
        context_length: 32768,
        pricing: { prompt: "0", completion: "0" },
        architecture: { input_modalities: ["text"], output_modalities: ["text"] },
        top_provider: { max_completion_tokens: 8192, is_moderated: false }
      },
      {
        id: "liquid/lfm-40b:free",
        name: "LFM 40B (Free)",
        description: "Liquid AI's efficient model",
        context_length: 32768,
        pricing: { prompt: "0", completion: "0" },
        architecture: { input_modalities: ["text"], output_modalities: ["text"] },
        top_provider: { max_completion_tokens: 4096, is_moderated: false }
      },
    ];
    
    return NextResponse.json(
      { 
        error: errorMessage,
        data: fallbackModels,
        isFallback: true,
      },
      { status: 200 } // 返回 200 让前端至少可以显示后备模型
    );
  }
}
