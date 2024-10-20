
import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import AuthPage from '../../components/AuthPage';

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect('/chat');
  }

  return <AuthPage />;
}
