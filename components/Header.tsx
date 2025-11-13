
import React from 'react';
import { SearchIcon, LogoutIcon } from './Icons';

interface HeaderProps {
    onLogout: () => void;
    onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, onOpenCommandPalette }) => {
  return (
    <header className="h-16 bg-gray-900 flex-shrink-0 flex items-center justify-between px-6 border-b border-gray-700">
      <h1 className="text-lg font-semibold text-white">Developer Dashboard</h1>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={onOpenCommandPalette} 
          title="Command Palette (Ctrl+K)"
          className="hidden md:flex items-center space-x-2 p-2 text-gray-400 hover:text-white focus:outline-none bg-gray-800 hover:bg-gray-700 rounded-md"
        >
          <SearchIcon className="h-5 w-5" />
          <span className="text-sm">Search...</span>
          <kbd className="ml-2 text-xs font-sans bg-gray-600/80 px-1.5 py-0.5 rounded">Ctrl+K</kbd>
        </button>
        <button 
          onClick={onOpenCommandPalette} 
          title="Command Palette (Ctrl+K)"
          className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
        >
          <SearchIcon className="h-6 w-6" />
        </button>

        <button className="relative p-2 text-gray-400 hover:text-white focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
           <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
        </button>
        <div className="relative">
            <div className="flex items-center space-x-3">
                <img className="h-8 w-8 rounded-full" src="https://picsum.photos/100" alt="User" />
                <span className="text-white font-medium hidden sm:inline">dev-user</span>
                <button onClick={onLogout} title="Logout" className="p-1 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <LogoutIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};
