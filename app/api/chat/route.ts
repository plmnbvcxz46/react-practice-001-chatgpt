import { MessageRequestBody } from "@/types/chat";
import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { ProxyAgent, setGlobalDispatcher } from "undici";

// 配置代理（如果设置了代理环境变量）
if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "";
  console.log("✓ 使用代理:", proxyUrl);
  try {
    const proxyAgent = new ProxyAgent({
      uri: proxyUrl,
      keepAliveTimeout: 10000,
      keepAliveMaxTimeout: 10000,
    });
    setGlobalDispatcher(proxyAgent);
    console.log("✓ 代理配置成功");
  } catch (error) {
    console.error("✗ 代理配置失败:", error);
  }
} else {
  console.log("⚠ 未检测到代理环境变量 (HTTP_PROXY/HTTPS_PROXY)");
  console.log("如果需要使用代理访问 Gemini API，请设置环境变量");
}

export async function GET() {
  return new Response("请使用 POST 请求", { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model } = (await request.json()) as MessageRequestBody;
    
    console.log("接收到请求，模型:", model);
    console.log("消息数量:", messages.length);
    
    // 检查环境变量
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY 环境变量未设置");
      return new Response(
        JSON.stringify({ error: "API 密钥未配置" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 初始化 Gemini AI 客户端 (自动从环境变量 GEMINI_API_KEY 获取密钥)
    const ai = new GoogleGenAI({});
    
    // 获取用户最后一条消息
    const prompt = messages[messages.length - 1].content;
    
    // 根据 model 参数选择使用的模型
    const modelName = model === "g2.5pro" ? "gemini-2.5-pro" : "gemini-2.5-flash";
    
    console.log("使用模型:", modelName);
    console.log("提示词:", prompt.substring(0, 100));
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("开始调用 Gemini API...");
          console.log("API 端点: https://generativelanguage.googleapis.com");
          console.log("请求模型:", modelName);
          
          const startTime = Date.now();
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
          });
          const endTime = Date.now();
          
          console.log(`✓ 收到 Gemini API 响应 (耗时: ${endTime - startTime}ms)`);
          const text = response.text || "";
          console.log("响应长度:", text.length, "字符");
          
          // 逐字符流式传输响应
          for (let i = 0; i < text.length; i++) {
            controller.enqueue(encoder.encode(text[i]));
          }
          
          controller.close();
          console.log("✓ 流式传输完成");
        } catch (error) {
          console.error("✗ Gemini API 错误:", error);
          
          // 详细的错误信息
          let errorMessage = "未知错误";
          if (error instanceof Error) {
            errorMessage = error.message;
            console.error("错误堆栈:", error.stack);
            
            // 检查是否是网络错误
            if (errorMessage.includes("fetch failed")) {
              errorMessage = "网络连接失败，请检查：\n1. 代理是否已启动 (Clash/V2Ray)\n2. 环境变量 HTTP_PROXY 和 HTTPS_PROXY 是否正确设置\n3. 防火墙是否阻止连接";
            } else if (errorMessage.includes("ECONNREFUSED")) {
              errorMessage = "连接被拒绝，代理服务可能未运行";
            } else if (errorMessage.includes("ETIMEDOUT")) {
              errorMessage = "连接超时，请检查代理配置或网络连接";
            }
          }
          
          controller.enqueue(encoder.encode(`错误: ${errorMessage}`));
          controller.close();
        }
      },
    });
    
    return new Response(stream);
  } catch (error) {
    console.error("请求处理错误:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "未知错误" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}