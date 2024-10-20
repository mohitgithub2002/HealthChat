import Sidebar from '@/components/Sidebar';
import React from 'react';

export default function ChatTemplate({ children }) {
  return (
    <div className="chat-layout">
      {/* You can add any common layout elements for the chat pages here */}
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-teal-50">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </div>
    </div>
  );
}
