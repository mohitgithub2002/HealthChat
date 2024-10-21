import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { Conversation } from '@/models/DatabaseModels';
import { getServerSession } from "next-auth/next";
import { authOption } from "../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userEmail = session.user.email;
    const conversations = await Conversation.find({ userEmail }).sort({ updatedAt: -1 });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}