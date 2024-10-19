import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { Message } from '@/models/DatabaseModels';

export async function POST(request) {
  try {
    await dbConnect();

    const { threadId } = await request.json();

    if (!threadId) {
      return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
    }

    const messages = await Message.find({ threadId }).sort({ timestamp: 1 });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
