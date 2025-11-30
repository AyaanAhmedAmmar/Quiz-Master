import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { HiPlus, HiTrash, HiCheck, HiX } from 'react-icons/hi';

function CreateQuiz() {
  const navigate = useNavigate();
  const { createQuiz } = useQuiz();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    timeLimit: 10,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  function handleQuizDataChange(e) {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: name === 'timeLimit' ? parseInt(value) : value
    }));
  }

  function handleQuestionChange(e) {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleOptionChange(index, value) {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  }

  function handleCorrectAnswerChange(index) {
    setCurrentQuestion(prev => ({
      ...prev,
      correctAnswer: index
    }));
  }

  function handleTypeChange(type) {
    if (type === 'true-false') {
      setCurrentQuestion({
        type: 'true-false',
        question: currentQuestion.question,
        options: ['True', 'False'],
        correctAnswer: 0
      });
    } else {
      setCurrentQuestion({
        type: 'multiple-choice',
        question: currentQuestion.question,
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  }

  function addQuestion() {
    if (!currentQuestion.question.trim()) {
      setError('Please enter a question');
      return;
    }

    if (currentQuestion.type === 'multiple-choice') {
      const filledOptions = currentQuestion.options.filter(opt => opt.trim());
      if (filledOptions.length < 2) {
        setError('Please provide at least 2 options');
        return;
      }
    }

    setError('');
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion, id: Date.now() }]
    }));

    // Reset current question
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
  }

  function removeQuestion(index) {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!quizData.title.trim()) {
      setError('Please enter a quiz title');
      return;
    }

    if (quizData.questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const quizId = await createQuiz(quizData);
      navigate(`/quiz/${quizId}`);
    } catch (error) {
      setError('Failed to create quiz. Please try again.');
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Quiz</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Quiz Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={quizData.title}
                onChange={handleQuizDataChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter quiz title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={quizData.description}
                onChange={handleQuizDataChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter quiz description"
              />
            </div>

            <div>
              <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                id="timeLimit"
                name="timeLimit"
                value={quizData.timeLimit}
                onChange={handleQuizDataChange}
                min={1}
                max={180}
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Added Questions */}
        {quizData.questions.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Questions ({quizData.questions.length})
            </h2>
            
            <div className="space-y-4">
              {quizData.questions.map((q, index) => (
                <div key={q.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary-100 text-primary-600 text-xs font-medium px-2 py-1 rounded">
                        Q{index + 1}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {q.type.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">{q.question}</p>
                    <div className="mt-2 space-y-1">
                      {q.options.map((opt, optIndex) => (
                        opt && (
                          <div key={optIndex} className="flex items-center gap-2 text-sm">
                            {optIndex === q.correctAnswer ? (
                              <HiCheck className="w-4 h-4 text-green-600" />
                            ) : (
                              <HiX className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={optIndex === q.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}>
                              {opt}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Question */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Question</h2>
          
          <div className="space-y-4">
            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleTypeChange('multiple-choice')}
                  className={`px-4 py-2 rounded-lg border ${
                    currentQuestion.type === 'multiple-choice'
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Multiple Choice
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('true-false')}
                  className={`px-4 py-2 rounded-lg border ${
                    currentQuestion.type === 'true-false'
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  True/False
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Question *
              </label>
              <textarea
                id="question"
                name="question"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your question"
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options (click to mark correct answer)
              </label>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCorrectAnswerChange(index)}
                      className={`p-2 rounded-full ${
                        currentQuestion.correctAnswer === index
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <HiCheck className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      disabled={currentQuestion.type === 'true-false'}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <HiPlus className="w-5 h-5" />
              Add Question
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || quizData.questions.length === 0}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuiz;
