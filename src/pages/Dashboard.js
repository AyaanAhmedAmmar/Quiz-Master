import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';
import { HiPlusCircle, HiCollection, HiChartBar, HiClock, HiUsers, HiTrash, HiPencil } from 'react-icons/hi';

function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const { getMyQuizzes, getMyResults, deleteQuiz } = useQuiz();
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quizzes');

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        const [quizzes, results] = await Promise.all([
          getMyQuizzes(),
          getMyResults()
        ]);
        if (isMounted) {
          setMyQuizzes(quizzes);
          setMyResults(results);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      if (isMounted) setLoading(false);
    }
    
    fetchData();
    return () => { isMounted = false; };
  }, []);

  async function handleDeleteQuiz(quizId) {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(quizId);
        setMyQuizzes(myQuizzes.filter(quiz => quiz.id !== quizId));
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  }

  const averageScore = myResults.length > 0
    ? Math.round(myResults.reduce((acc, r) => acc + r.percentage, 0) / myResults.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {currentUser.displayName}! 👋
        </h1>
        <p className="text-primary-100">
          Ready to create or take some quizzes today?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Quizzes Created</p>
              <p className="text-3xl font-bold text-gray-900">{myQuizzes.length}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <HiCollection className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Quizzes Taken</p>
              <p className="text-3xl font-bold text-gray-900">{myResults.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <HiChartBar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{averageScore}%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <HiChartBar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Plays</p>
              <p className="text-3xl font-bold text-gray-900">
                {myQuizzes.reduce((acc, q) => acc + (q.timesPlayed || 0), 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <HiUsers className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          to="/create-quiz"
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
        >
          <HiPlusCircle className="w-5 h-5" />
          Create New Quiz
        </Link>
        <Link
          to="/quizzes"
          className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
          <HiCollection className="w-5 h-5" />
          Browse Quizzes
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'quizzes'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Quizzes ({myQuizzes.length})
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'results'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Results ({myResults.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'quizzes' ? (
            myQuizzes.length > 0 ? (
              <div className="space-y-4">
                {myQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                      <p className="text-sm text-gray-500">
                        {quiz.questions?.length || 0} questions • {quiz.timesPlayed || 0} plays
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/edit-quiz/${quiz.id}`}
                        className="p-2 text-gray-500 hover:text-primary-600 transition"
                      >
                        <HiPencil className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HiCollection className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
                <p className="text-gray-500 mb-4">Create your first quiz to get started!</p>
                <Link
                  to="/create-quiz"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                >
                  <HiPlusCircle className="w-5 h-5" />
                  Create Quiz
                </Link>
              </div>
            )
          ) : myResults.length > 0 ? (
            <div className="space-y-4">
              {myResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{result.quizTitle}</h3>
                    <p className="text-sm text-gray-500">
                      <HiClock className="w-4 h-4 inline mr-1" />
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      result.percentage >= 70 ? 'text-green-600' : 
                      result.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {result.percentage}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {result.score}/{result.totalQuestions} correct
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HiChartBar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
              <p className="text-gray-500 mb-4">Take a quiz to see your results here!</p>
              <Link
                to="/quizzes"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                <HiCollection className="w-5 h-5" />
                Browse Quizzes
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
