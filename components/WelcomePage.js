import React from 'react';
import Link from 'next/link';
import { Bot, Heart, Shield, ArrowRight } from 'lucide-react';
import Logo from './Logo';

const WelcomePage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-between bg-gradient-to-br from-teal-100 via-blue-100 to-purple-100 text-gray-800 p-8 overflow-y-auto">
      <div className="w-full max-w-6xl flex flex-col items-center">
        <div className="flex justify-center mb-6 animate-bounce">
          <Logo className="h-12 w-12 text-teal-600 mr-2" />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
          Welcome to HealthChat
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-center text-gray-700 max-w-3xl">
          Your AI-powered health companion for personalized wellness advice and support.
        </p>
      </div>
      
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        <FeatureCard
          icon={<Bot className="w-12 h-12 text-teal-500" />}
          title="AI-Powered Assistance"
          description="Get instant, accurate health information and advice from our advanced AI."
        />
        <FeatureCard
          icon={<Heart className="w-12 h-12 text-pink-500" />}
          title="Personalized Wellness"
          description="Receive tailored recommendations for your unique health journey."
        />
        <FeatureCard
          icon={<Shield className="w-12 h-12 text-blue-500" />}
          title="Private & Secure"
          description="Your health data is protected with state-of-the-art encryption."
        />
      </div>
      
      <div className="text-center">
        <Link href="/chat" className="group inline-flex items-center bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
          Start Your Health Journey
          <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
        </Link>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out border border-teal-200 transform hover:-translate-y-1">
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-center text-gray-800">{title}</h3>
      <p className="text-gray-600 text-center text-sm">{description}</p>
    </div>
  );
};

export default WelcomePage;
