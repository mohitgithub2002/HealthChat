'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PlusCircle, X } from 'lucide-react';
import Logo from './Logo';

const fetchConversations = async () => {
  try {
    const response = await fetch('/api/conversations');
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    const data = await response.json();
    return data.conversations || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState({ threadId: null });

  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      const fetchedConversations = await fetchConversations();
      setConversations(fetchedConversations);
      setIsLoading(false);
    };
    loadConversations();
  }, []);

  useEffect(() => {
    const threadId = pathname.split('/').pop();
    if (threadId !== 'chat') {
      setCurrentChat({ threadId });
    }
  }, [pathname]);

  const startNewChat = () => {
    router.push('/chat');
  };

  const switchChat = (chat) => {
    router.push(`/chat/${chat.threadId}`);
  };

  return (
    <div className="hidden md:block w-72 bg-white shadow-lg">
      <div className="w-full h-full bg-white p-6">
        <div className="flex items-center justify-center mb-6">
          <Logo className="h-8 w-8 text-teal-600 mr-2" />
          <span className="text-xl font-semibold text-teal-900">HealthChat</span>
        </div>
        <button 
          className="w-full mb-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          onClick={startNewChat}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Consultation
        </button>
        <div className="h-[calc(100vh-180px)] overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading conversations...</p>
          ) : conversations.length > 0 ? (
            conversations.map((chat) => (
              <div 
                key={chat.id} 
                className={`py-3 px-4 mb-2 hover:bg-teal-50 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
                  currentChat.threadId === chat.threadId ? 'bg-teal-100' : ''
                }`}
                onClick={() => switchChat(chat)}
              >
                <p className="text-sm font-medium text-teal-900">{chat.title}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No conversations yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
