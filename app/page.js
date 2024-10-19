'use client'
import { useState } from 'react';
import WelcomePage from '../components/WelcomePage';
import ChatInterface from '../components/ChatInterface';

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {!showChat && <WelcomePage />}
      {showChat && <ChatInterface />}
    </>
  );
}
