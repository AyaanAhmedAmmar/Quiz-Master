import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { HiClock, HiChevronLeft, HiChevronRight, HiCheck } from 'react-icons/hi';

function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { getQuizById, submitQuizResult } = useQuiz();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const fetchQuiz = useCallback(async () => {
    try {
      const data = await getQuizById(quizId);
      if (data) {
        setQuiz(data);
        setTimeLeft(data.timeLimit * 60);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
    setLoading(false);
  }, [getQuizById, quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleSubmit = useCallback(async () => {
    if (submitting || result) return;
    
    setSubmitting(true);
    
    // Calculate score
    let score = 0;
    const answerDetails = quiz.questions.map((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score++;
      return {
        questionIndex: index,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);
    const timeTaken = (quiz.timeLimit * 60) - timeLeft;

    try {
      const resultData = await submitQuizResult(quizId, {
        quizTitle: quiz.title,
        score,
        totalQuestions: quiz.questions.length,
        percentage,
        answers: answerDetails,
        timeTaken
      });
      setResult(resultData);
    } catch (error) {
      console.error('Error submitting result:', error);
    }
    setSubmitting(false);
  }, [quiz, answers, timeLeft, quizId, submitQuizResult, submitting, result]);

  // Timer effect
  useEffect(() => {
    if (!started || timeLeft <= 0 || result) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft, result, handleSubmit]);

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function handleAnswerSelect(answerIndex) {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  }

  function goToNextQuestion() {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }

  function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz not found</h1>
        <button
          onClick={() => navigate('/quizzes')}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Browse Quizzes
        </button>
      </div>
    );
  }

  // Show result screen
  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            result.percentage >= 70 ? 'bg-green-100' : 
            result.percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <span className={`text-3xl font-bold ${
              result.percentage >= 70 ? 'text-green-600' : 
              result.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {result.percentage}%
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
          <p className="text-gray-600 mb-6">
            You scored {result.score} out of {result.totalQuestions} questions correctly
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Time Taken</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatTime(result.timeTaken)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Questions</p>
              <p className="text-xl font-semibold text-gray-900">
                {result.totalQuestions}
              </p>
            </div>
          </div>

          {/* Answer Review */}
          <div className="text-left mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Answers</h2>
            <div className="space-y-4">
              {quiz.questions.map((q, index) => {
                const answer = result.answers[index];
                return (
                  <div key={index} className={`p-4 rounded-lg border-2 ${
                    answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        answer.isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                        <div className="space-y-1 text-sm">
                          {q.options.map((opt, optIndex) => (
                            opt && (
                              <div key={optIndex} className={`flex items-center gap-2 ${
                                optIndex === q.correctAnswer ? 'text-green-700 font-medium' :
                                optIndex === answer.userAnswer && !answer.isCorrect ? 'text-red-700' : 'text-gray-600'
                              }`}>
                                {optIndex === q.correctAnswer && <HiCheck className="w-4 h-4" />}
                                {optIndex === answer.userAnswer && optIndex !== q.correctAnswer && (
                                  <span className="w-4 h-4 text-center">✗</span>
                                )}
                                {optIndex !== q.correctAnswer && optIndex !== answer.userAnswer && (
                                  <span className="w-4 h-4"></span>
                                )}
                                <span>{opt}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/quizzes')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Browse More Quizzes
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show start screen
  if (!started) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-gray-600 mb-6">{quiz.description}</p>
          )}
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Questions</p>
              <p className="text-2xl font-semibold text-gray-900">{quiz.questions.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Time Limit</p>
              <p className="text-2xl font-semibold text-gray-900">{quiz.timeLimit} min</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Created By</p>
              <p className="text-lg font-semibold text-gray-900">{quiz.creatorName}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 text-sm">
              ⚠️ Once you start the quiz, the timer will begin. Make sure you have enough time to complete it.
            </p>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz taking interface
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with Timer */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-700'
        }`}>
          <HiClock className="w-5 h-5" />
          <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all"
          style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-primary-100 text-primary-600 text-sm font-medium px-3 py-1 rounded-full">
            Question {currentQuestionIndex + 1}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {currentQuestion.type.replace('-', ' ')}
          </span>
        </div>

        <h2 className="text-xl font-medium text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            option && (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition ${
                  answers[currentQuestionIndex] === index
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    answers[currentQuestionIndex] === index
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <HiChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition ${
                index === currentQuestionIndex
                  ? 'bg-primary-600 text-white'
                  : answers[index] !== undefined
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
            <HiCheck className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={goToNextQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Next
            <HiChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Answered indicator */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {answeredCount} of {quiz.questions.length} questions answered
      </div>
    </div>
  );
}

export default TakeQuiz;
