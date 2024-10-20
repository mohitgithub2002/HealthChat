'use client'
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Logo from './Logo';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Registration successful, sign in the user
        await signIn('credentials', { email, password, callbackUrl: '/chat' });
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/chat' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-blue-100">
      <div className="w-full max-w-sm p-6 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-center">
          <Logo className="w-20 h-20 transition-transform duration-300 ease-in-out transform hover:scale-110 text-teal-600" />
        </div>
        <h2 className="mt-4 text-3xl font-bold text-center text-gray-900">
          Create your account
        </h2>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition duration-300 ease-in-out"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition duration-300 ease-in-out"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition duration-300 ease-in-out"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>

        <div className="text-xs text-center">
          <button
            className="font-medium text-teal-600 hover:text-teal-500 transition duration-300 ease-in-out"
            onClick={() => signIn(undefined, { callbackUrl: '/chat' })}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
