import { sleep } from "@/common/util";
import { NextRequest } from "next/server";

export async function GET() {
  return new Response("请使用 POST 请求", { status: 200 });
}

export async function POST(requst: NextRequest) {
  const {messageText} = await requst.json();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < messageText.length; i++) {
        await sleep(100);
        controller.enqueue(encoder.encode(messageText[i]));
      }
      controller.close();
    },
  });
  return new Response(stream);
}