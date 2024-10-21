'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PlusCircle, MessageSquare, Settings, LogOut, X } from 'lucide-react';
import Logo from './Logo';
import { signOut } from "next-auth/react";

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

export default function Sidebar({ isOpen, toggleSidebar }) {
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
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const switchChat = (chat) => {
    router.push(`/chat/${chat.threadId}`);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed md:static inset-y-0 left-0 w-80 bg-gradient-to-b from-teal-600 to-teal-800 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col h-full`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Logo className="h-10 w-10 text-white mr-3" />
              <span className="text-2xl font-bold">HealthChat</span>
            </div>
            <button 
              className="md:hidden text-white"
              onClick={toggleSidebar}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <button 
            className="w-full mb-6 bg-white text-teal-800 font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-teal-100 flex items-center justify-center"
            onClick={startNewChat}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            New Consultation
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto px-4 mx-2">
          <h2 className="text-lg font-semibold mb-4 px-2">Recent Consultations</h2>
          {isLoading ? (
            <p className="text-center text-teal-200">Loading conversations...</p>
          ) : conversations.length > 0 ? (
            conversations.map((chat) => (
              <div 
                key={chat.id} 
                className={`py-3 px-4 mb-2 hover:bg-teal-700 rounded-lg cursor-pointer transition duration-200 ease-in-out flex items-center ${
                  currentChat.threadId === chat.threadId ? 'bg-white text-teal-900' : ''
                }`}
                onClick={() => switchChat(chat)}
              >
                <MessageSquare className="h-5 w-5 mr-3 text-teal-00" />
                <p className="text-sm font-medium truncate">{chat.title}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-teal-200">No conversations yet</p>
          )}
        </div>
        
        <div className="p-4 border-t border-teal-500">
          <button className="w-full py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-200 ease-in-out flex items-center">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </button>
          <button 
            className="w-full mt-2 py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-200 ease-in-out flex items-center"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
