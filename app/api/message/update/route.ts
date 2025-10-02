import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
  const body = await request.json()
  const { id, ... data} = body
  if (!data.chaId){
    const chat = await prisma.chat.create({
      data: {
        title: "new chat"
      }
    })
    data.chatId = chat.id
  }
  let message = await prisma.message.upsert({
    create: data,
    update: data,
    where: {
      id
    }
  })
  return NextResponse.json({code: 0, data: {message}})
}