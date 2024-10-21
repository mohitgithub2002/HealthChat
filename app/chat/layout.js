'use client'
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-grow">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-grow overflow-y-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}
