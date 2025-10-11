import { MessageRequestBody } from "@/types/chat";
import { NextRequest } from "next/server";

export async function GET() {
  return new Response("请使用 POST 请求", { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model } = (await request.json()) as MessageRequestBody;
    
    // 检查环境变量
    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenRouter API 密钥未配置" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 将消息转换为 OpenRouter/OpenAI 格式
    const openRouterMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // 调用 OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.OPENROUTER_SITE_NAME || "ChatGPT Clone",
      },
      body: JSON.stringify({
        model: model || "openai/gpt-4o-mini",
        messages: openRouterMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      return new Response(
        JSON.stringify({ error: errorData.error?.message || "请求失败" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("无法读取响应流");
          }

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              
              // 跳过空行和注释
              if (!trimmedLine || trimmedLine.startsWith(":")) {
                continue;
              }

              // 处理 SSE 数据
              if (trimmedLine.startsWith("data: ")) {
                const data = trimmedLine.slice(6);
                
                // 检查是否是结束标记
                if (data === "[DONE]") {
                  break;
                }

                try {
                  const parsed = JSON.parse(data);
                  
                  // 检查是否有错误
                  if (parsed.error) {
                    controller.enqueue(encoder.encode(`\n\n错误: ${parsed.error.message}`));
                    break;
                  }

                  // 提取内容
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }

                  // 检查是否完成
                  const finishReason = parsed.choices?.[0]?.finish_reason;
                  if (finishReason === "stop" || finishReason === "error") {
                    break;
                  }
                } catch (parseError) {
                  // 忽略 JSON 解析错误
                  console.error("JSON 解析错误:", parseError);
                }
              }
            }
          }
          
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "未知错误";
          controller.enqueue(encoder.encode(`\n\n错误: ${errorMessage}`));
          controller.close();
        }
      },
    });
    
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "未知错误" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}