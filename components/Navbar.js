'use client'
import React, { useState } from 'react';
import { User, Settings, LogOut, Heart, Pill, Menu } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Navbar({ toggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 flex justify-between items-center w-full text-black relative z-50 bg-white shadow-sm"
    >
      {/* Hamburger menu and logo for mobile */}
      <div className="flex items-center md:hidden">
        <button onClick={toggleSidebar} className="mr-4">
          <Menu className="h-6 w-6 text-teal-600" />
        </button>
        <Logo className="h-10 w-10 text-teal-700 mr-3" />
        <span className="text-2xl text-teal-700 font-bold">HealthChat</span>
      </div>

      {/* Profile dropdown */}
      <div className="relative ml-auto">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
        >
          {session?.user?.image ? (
            <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
          ) : (
            session?.user?.name?.charAt(0) || 'U'
          )}
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <p className="px-4 py-2 text-md font-bold text-teal-700">{session?.user?.name || 'My Health Profile'}</p>
            {/* <hr />
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Personal Info</span>
            </button> */}
            {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
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
            </button> */}
            <hr />
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
