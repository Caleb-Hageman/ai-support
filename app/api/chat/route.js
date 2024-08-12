import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    // Extract the user's message from the request body
    const params = await req.json();
    const userMessage = params.someData; // This contains the message sent from the frontend
    
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a conversational AI assistant. Be friendly and helpful. Also you only have 500 tokens make sure you dont get cut off. keep it short and sweet",
            },
            {
                role: "user",
                content: userMessage
            }
        ],
        temperature: 0,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    })

    return NextResponse.json(response.choices[0].message.content);

}