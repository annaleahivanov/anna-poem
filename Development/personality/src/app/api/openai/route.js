import { NextResponse } from 'next/server'
import OpenAI from "openai";

export async function POST(request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    const data = await request.json();
    console.log(`got a request: ${JSON.stringify(data, null, 4)}`);
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: "If a user is most like these words: " + data.prompt + ", what 10 highly specific fictional characters, each with their own distinctive personalities, can you think of that would get similar results from taking this quiz and stand out from the typical preferences of most other fictional characters (no explanations needed)?",
      max_tokens: 1000,
      temperature: 0,
    });
  
    console.log(completion);
  
  
  return NextResponse.json({ completion, params: data });
}