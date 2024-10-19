'use client'
import { useParams } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  const params = useParams();
  const threadId = params.threadId;

  return <ChatInterface initialThreadId={threadId} />;
}
