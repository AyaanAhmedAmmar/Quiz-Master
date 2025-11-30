import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HiMenu, HiX, HiLogout, HiUser, HiHome, HiPlusCircle, HiCollection } from 'react-icons/hi';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">QuizMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-primary-700 transition"
                >
                  <HiHome className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/quizzes"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-primary-700 transition"
                >
                  <HiCollection className="w-5 h-5" />
                  <span>Browse Quizzes</span>
                </Link>
                <Link
                  to="/create-quiz"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-primary-700 transition"
                >
                  <HiPlusCircle className="w-5 h-5" />
                  <span>Create Quiz</span>
                </Link>
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-primary-400">
                  <span className="flex items-center space-x-1">
                    <HiUser className="w-5 h-5" />
                    <span>{currentUser.displayName}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md bg-primary-700 hover:bg-primary-800 transition"
                  >
                    <HiLogout className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md hover:bg-primary-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md bg-white text-primary-600 hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-primary-700 transition"
            >
              {isMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-primary-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HiHome className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/quizzes"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-primary-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HiCollection className="w-5 h-5" />
                  <span>Browse Quizzes</span>
                </Link>
                <Link
                  to="/create-quiz"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-primary-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HiPlusCircle className="w-5 h-5" />
                  <span>Create Quiz</span>
                </Link>
                <div className="border-t border-primary-500 pt-2 mt-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <HiUser className="w-5 h-5" />
                    <span>{currentUser.displayName}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-md hover:bg-primary-600 transition"
                  >
                    <HiLogout className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md hover:bg-primary-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md hover:bg-primary-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
