'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Send, User, Settings, LogOut, Heart, Stethoscope, Pill, Menu, Thermometer, Brain, Lungs, Activity, Moon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Logo from './Logo';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

const fetchChatHistory = async (threadId) => {
  try {
    const response = await fetch('/api/chat-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threadId }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }
    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

const sendMessageToGemini = async (threadId, message) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threadId, prompt: message }),
    });
    if (!response.ok) {
      throw new Error('Failed to send message to Gemini');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    throw error;
  }
};

export default function ChatInterface({ initialThreadId }) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState({ title: "New Consultation", threadId: initialThreadId });
  const [chatStarted, setChatStarted] = useState(!!initialThreadId);
  const { data: session } = useSession();

  const suggestions = [
    { text: "What are the symptoms of the flu?", icon: <Thermometer className="w-5 h-5 mr-2" /> },
    { text: "How can I manage my stress levels?", icon: <Brain className="w-5 h-5 mr-2" /> },
    { text: "What's a balanced diet for heart health?", icon: <Heart className="w-5 h-5 mr-2" /> },
    { text: "How much sleep should I be getting?", icon: <Moon className="w-5 h-5 mr-2" /> }
  ];

  const loadChatHistory = useCallback(async (threadId) => {
    if (threadId && session) {
      const history = await fetchChatHistory(threadId);
      setMessages(history.map(msg => ({
        id: msg._id,
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai'
      })));
    }
  }, [session]);

  useEffect(() => {
    if (currentChat.threadId && session) {
      loadChatHistory(currentChat.threadId);
      router.push(`/chat/${currentChat.threadId}`);
    } else {
      router.push('/chat');
    }
  }, [currentChat.threadId, router, loadChatHistory, session]);

  const handleSend = async () => {
    if (input.trim() && session) {
      let threadId = currentChat.threadId;
      const newUserMessage = { id: Date.now().toString(), content: input, sender: "user" };
      setMessages(prev => [...prev, newUserMessage]);
      setInput('');

      let newchat = false;
      if(!chatStarted) {
        newchat = true;
        setChatStarted(true);
      }

      try {
        const { response, threadId: newThreadId } = await sendMessageToGemini(threadId, input);
        
        if (newchat) {
          setChatStarted(true);
          const newConversation = { id: newThreadId, title: input, threadId: newThreadId };
          setCurrentChat(newConversation);
          router.push(`/chat/${newThreadId}`, undefined, { shallow: true });
        }

        const aiResponse = { id: Date.now().toString(), content: response, sender: "ai" };
        setMessages(prev => [...prev, aiResponse]);

      } catch (error) {
        console.error('Error sending message:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {!chatStarted ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h3 className="text-3xl font-bold text-teal-800 mb-2">Welcome to HealthChat</h3>
                <p className="text-teal-600 mb-6">Your personal AI medical assistant. How can we help you today?</p>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {suggestions.map((suggestion, index) => (
                  <motion.button 
                    key={index}
                    whileHover={{ scale: 1.03, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center text-left text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl p-4 transition duration-300 ease-in-out"
                    onClick={() => {
                      setInput(suggestion.text);
                      handleSend();
                    }}
                  >
                    {suggestion.icon}
                    <span>{suggestion.text}</span>
                  </motion.button>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8 text-center"
              >
                <p className="text-teal-600 mb-4">Or type your own question below to get started</p>
                <Activity className="w-6 h-6 text-teal-500 mx-auto animate-pulse" />
              </motion.div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-start ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3">
                    <Logo className="h-5 w-5" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white shadow-md'
                  } max-w-[80%]`}
                >
                  {message.sender === 'user' ? (
                    <p className="text-sm text-white">{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      className="text-sm text-teal-900 prose prose-sm max-w-none"
                      components={{
                        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-md font-bold mb-2" {...props} />,
                        code: ({ node, inline, ...props }) => (
                          inline 
                            ? <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
                            : <pre className="bg-gray-100 rounded p-2 overflow-x-auto"><code {...props} /></pre>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white ml-3 overflow-hidden">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                      session?.user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Input Area - Moved outside the scrollable area */}
      <div className="p-4 md:p-6 bg-transparent">
        <div className="max-w-3xl mx-auto flex items-center">
          <input
            type="text"
            placeholder="Type your health question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 mr-4 text-black bg-blue-50 border border-teal-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300 ease-in-out"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
