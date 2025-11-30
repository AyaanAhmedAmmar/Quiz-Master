import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import QuizList from './pages/QuizList';
import TakeQuiz from './pages/TakeQuiz';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <QuizProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-quiz"
                element={
                  <PrivateRoute>
                    <CreateQuiz />
                  </PrivateRoute>
                }
              />
              <Route
                path="/quizzes"
                element={
                  <PrivateRoute>
                    <QuizList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/quiz/:quizId"
                element={
                  <PrivateRoute>
                    <TakeQuiz />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </QuizProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
