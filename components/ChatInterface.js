'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Send, User, Settings, LogOut, Heart, Stethoscope, Pill, Menu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Logo from './Logo';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const suggestions = [
    "What are the symptoms of the flu?",
    "How can I manage my stress levels?",
    "What's a balanced diet for heart health?",
    "How much sleep should I be getting?"
  ];

  const loadChatHistory = useCallback(async (threadId) => {
    if (threadId) {
      const history = await fetchChatHistory(threadId);
      setMessages(history.map(msg => ({
        id: msg._id,
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai'
      })));
    }
  }, []);

  useEffect(() => {
    if (currentChat.threadId) {
      loadChatHistory(currentChat.threadId);
      router.push(`/chat/${currentChat.threadId}`);
    } else {
      router.push('/chat');
    }
  }, [currentChat.threadId, router, loadChatHistory]);

  const handleSend = async () => {
    if (input.trim()) {
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
          router.replace(`/chat/${newThreadId}`);
        }

        const aiResponse = { id: Date.now().toString(), content: response, sender: "ai" };
        setMessages(prev => [...prev, aiResponse]);

      } catch (error) {
        console.error('Error sending message:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  const startNewChat = async () => {
    setMessages([]);
    setCurrentChat({ title: "New Consultation", threadId: null });
    setChatStarted(false);
    setIsMobileMenuOpen(false);
    router.push('/chat');
  };

  const switchChat = async (chat) => {
    setCurrentChat(chat);
    setChatStarted(true);
    await loadChatHistory(chat.threadId);
    setIsMobileMenuOpen(false);
    router.push(`/chat/${chat.threadId}`);
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center w-full text-black">
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden mr-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </button>
          <div className="flex items-center md:hidden">
            <Logo className="h-6 w-6 text-teal-600 mr-2" />
            <span className="text-xl font-semibold text-teal-900">HealthChat</span>
          </div>
          <div className="hidden md:flex items-center">
            <Stethoscope className="h-6 w-6 text-teal-600 mr-2" />
            <h2 className="text-xl font-semibold text-teal-900">{currentChat.title}</h2>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            JD
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <p className="px-4 py-2 text-sm text-gray-700 font-medium">My Health Profile</p>
              <hr />
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Personal Info</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                <span>Health Records</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Pill className="mr-2 h-4 w-4" />
                <span>Medications</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </button>
              <hr />
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {!chatStarted ? (
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-teal-800 mb-4">Welcome to Your Medical Assistant</h3>
              <p className="text-teal-600 mb-6">How can I assist you with your health today? Here are some suggestions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => (
                  <button 
                    key={index} 
                    className="text-left text-teal-700 hover:bg-teal-50 border border-teal-200 rounded-lg p-3"
                    onClick={() => {
                      setInput(suggestion);
                      handleSend();
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start mb-4 ${
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
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white ml-3">
                    You
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-transparent shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center">
          <input
            type="text"
            placeholder="Type your health question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 mr-4 text-black bg-blue-50 border border-teal-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}
