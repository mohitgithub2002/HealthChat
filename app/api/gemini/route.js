import {HarmCategory, HarmBlockThreshold, GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/utils/dbConnect";
import { Message, Conversation } from "@/models/DatabaseModels";
import { NextResponse } from 'next/server';
import { systemPrompt } from "./promptdata";
export async function POST(request) {
  try {
    let { prompt, threadId } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Connect to MongoDB
    await dbConnect();
    
    // Check if threadId is empty, create a new conversation if it is
    if (!threadId) {
      console.log("Creating new conversation");
      const title = prompt.split(' ').slice(0, 5).join(' ');
      console.log("Title:", title);
      const newConversation = await Conversation.create({ title });
      console.log("New conversation:", newConversation);
      threadId = newConversation.threadId;
      console.log("Creating new conversation with threadId:", threadId);
    }
    console.log("ThreadId:", threadId);
    const previousMessage = await Message.find({ threadId }).sort({ createdAt: -1 }).limit(10);
    const reversedPreviousMessage = previousMessage.reverse();
    // convert the array into strings and join them
    const previousChat = reversedPreviousMessage.map((message) => `${message.role}: ${message.content}`).join('\n');
    
    const promptTemplate = `System: ${systemPrompt}
                            Previouschat: ${previousChat}
                            User-Query: ${prompt}
                            `;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE	,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE	,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE	,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE	,
      },
    ];
    const model = genAI.getGenerativeModel({ model: "tunedModels/medichat-8ad5om60ruoi",safetySettings: safetySettings,  });
    console.log("Previous chat:", promptTemplate);
    const result = await model.generateContent(promptTemplate);
    const response = result.response;
    const aiMessage = response.text();

    // Store user message and AI response in the database
    await Message.create({
      threadId,
      content: prompt,
      role: 'user',
    });

    await Message.create({
      threadId,
      content: aiMessage,
      role: 'assistant',
    });

    return NextResponse.json({ 
      response: aiMessage,
      threadId,
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
