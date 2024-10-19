import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { Conversation } from '@/models/DatabaseModels';

export async function GET() {
  try {
    await dbConnect();

    const conversations = await Conversation.find({}).sort({ updatedAt: -1 });

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
