import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      {/* Main Container */}
      <div className="container mx-auto flex items-center justify-between">
        {/* Branding/Logo */}
        <div className="text-white font-bold text-xl">
          Notes Manager
        </div>

        {/* Desktop Navigation Links */}
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex space-x-4">
            <Link to="/login">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                    Login
                </button>
            </Link>
            <Link to="/register">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                    Register
                </button>
            </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block text-gray-300 hover:text-white">Home</a>
            <a href="#" className="block text-gray-300 hover:text-white">Notes</a>
            <a href="#" className="block text-gray-300 hover:text-white">Profile</a>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
              Login
            </button>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
