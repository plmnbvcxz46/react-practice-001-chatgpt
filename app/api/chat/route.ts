import { MessageRequestBody } from "@/types/chat";
import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

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
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
          });
          
          console.log("收到 Gemini API 响应");
          const text = response.text || "";
          console.log("响应长度:", text.length);
          
          // 逐字符流式传输响应
          for (let i = 0; i < text.length; i++) {
            controller.enqueue(encoder.encode(text[i]));
          }
          
          controller.close();
          console.log("流式传输完成");
        } catch (error) {
          console.error("Gemini API 错误:", error);
          const errorMessage = error instanceof Error ? error.message : "未知错误";
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