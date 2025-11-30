import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { HiSearch, HiClock, HiUsers, HiCollection } from 'react-icons/hi';

function QuizList() {
  const { getPublicQuizzes } = useQuiz();
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const data = await getPublicQuizzes();
        setQuizzes(data);
        setFilteredQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
      setLoading(false);
    }
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const filtered = quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Quizzes</h1>
          <p className="text-gray-600 mt-1">Find and take quizzes created by others</p>
        </div>
        
        {/* Search */}
        <div className="mt-4 md:mt-0">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search quizzes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {quiz.title}
                </h3>
                {quiz.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {quiz.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <HiCollection className="w-4 h-4" />
                    <span>{quiz.questions?.length || 0} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiClock className="w-4 h-4" />
                    <span>{quiz.timeLimit} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiUsers className="w-4 h-4" />
                    <span>{quiz.timesPlayed || 0} plays</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    By {quiz.creatorName}
                  </span>
                  <Link
                    to={`/quiz/${quiz.id}`}
                    className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition"
                  >
                    Start Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HiCollection className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm ? 'No quizzes found' : 'No quizzes available'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Be the first to create a quiz!'}
          </p>
          {!searchTerm && (
            <Link
              to="/create-quiz"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Create Quiz
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizList;
