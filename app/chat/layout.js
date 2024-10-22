import React from 'react';
import ClientWrapper from '@/components/ClientWrapper';

export default function ChatLayout({ children }) {
  return (
    <ClientWrapper>
      {children}
    </ClientWrapper>
  );
}
