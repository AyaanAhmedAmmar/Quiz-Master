import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiLightningBolt, HiClock, HiChartBar, HiDeviceMobile } from 'react-icons/hi';

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Welcome to QuizMaster
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Create, share, and take interactive quizzes. Perfect for educators, students, and anyone who loves learning!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/create-quiz"
                    className="px-8 py-4 bg-primary-700 text-white font-semibold rounded-lg border-2 border-white hover:bg-primary-800 transition"
                  >
                    Create a Quiz
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-primary-700 text-white font-semibold rounded-lg border-2 border-white hover:bg-primary-800 transition"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Online Quizzes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              QuizMaster provides all the tools you need to create engaging assessments and track performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="bg-primary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <HiLightningBolt className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Quiz Creation
              </h3>
              <p className="text-gray-600">
                Create quizzes in minutes with our intuitive builder. Support for multiple choice and true/false questions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <HiClock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Timed Assessments
              </h3>
              <p className="text-gray-600">
                Set time limits for your quizzes to create engaging, time-bound assessments.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <HiChartBar className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Instant Results
              </h3>
              <p className="text-gray-600">
                Get immediate feedback with automatic grading. Review answers and track your progress.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <HiDeviceMobile className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Works Everywhere
              </h3>
              <p className="text-gray-600">
                Access quizzes from any device - desktop, tablet, or mobile. Learn on the go!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join QuizMaster today and start creating engaging quizzes for free!
          </p>
          {!currentUser && (
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
            >
              Create Your Free Account
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold text-white mb-2">QuizMaster</p>
          <p className="text-sm">
            A Software Engineering Semester Project
          </p>
          <p className="text-sm mt-2">
            Built with React, Firebase, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
