import React, { createContext, useContext } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const QuizContext = createContext();

export function useQuiz() {
  return useContext(QuizContext);
}

export function QuizProvider({ children }) {
  const { currentUser } = useAuth();

  // Create a new quiz
  async function createQuiz(quizData) {
    const quiz = {
      ...quizData,
      creatorId: currentUser.uid,
      creatorName: currentUser.displayName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timesPlayed: 0,
      isPublished: true
    };
    
    const docRef = await addDoc(collection(db, 'quizzes'), quiz);
    
    // Update user's quiz count
    await updateDoc(doc(db, 'users', currentUser.uid), {
      quizzesCreated: increment(1)
    });
    
    return docRef.id;
  }

  // Get all public quizzes
  async function getPublicQuizzes() {
    try {
      const q = query(
        collection(db, 'quizzes'),
        where('isPublished', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const quizzes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side instead of using orderBy (avoids index requirement)
      return quizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error fetching public quizzes:', error);
      return [];
    }
  }

  // Get quizzes created by current user
  async function getMyQuizzes() {
    try {
      const q = query(
        collection(db, 'quizzes'),
        where('creatorId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const quizzes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side
      return quizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error fetching my quizzes:', error);
      return [];
    }
  }

  // Get a single quiz by ID
  async function getQuizById(quizId) {
    const docRef = doc(db, 'quizzes', quizId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }

  // Update a quiz
  async function updateQuiz(quizId, quizData) {
    const docRef = doc(db, 'quizzes', quizId);
    await updateDoc(docRef, {
      ...quizData,
      updatedAt: new Date().toISOString()
    });
  }

  // Delete a quiz
  async function deleteQuiz(quizId) {
    await deleteDoc(doc(db, 'quizzes', quizId));
    
    // Update user's quiz count
    await updateDoc(doc(db, 'users', currentUser.uid), {
      quizzesCreated: increment(-1)
    });
  }

  // Submit quiz result
  async function submitQuizResult(quizId, result) {
    const resultData = {
      quizId,
      quizTitle: result.quizTitle,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      answers: result.answers,
      timeTaken: result.timeTaken,
      submittedAt: new Date().toISOString()
    };
    
    try {
      // Save the result
      await addDoc(collection(db, 'results'), resultData);
      
      // Try to update quiz times played (don't fail if this doesn't work)
      try {
        await updateDoc(doc(db, 'quizzes', quizId), {
          timesPlayed: increment(1)
        });
      } catch (e) {
        console.log('Could not update quiz play count:', e);
      }
      
      // Try to update user stats (don't fail if this doesn't work)
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          quizzesTaken: increment(1)
        });
      } catch (e) {
        console.log('Could not update user stats:', e);
      }
      
      return resultData;
    } catch (error) {
      console.error('Error saving result:', error);
      // Still return the result data so UI can show it
      return resultData;
    }
  }

  // Get results for current user
  async function getMyResults() {
    try {
      const q = query(
        collection(db, 'results'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side
      return results.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } catch (error) {
      console.error('Error fetching results:', error);
      return [];
    }
  }

  // Get results for a specific quiz (for quiz creator)
  async function getQuizResults(quizId) {
    try {
      const q = query(
        collection(db, 'results'),
        where('quizId', '==', quizId)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side
      return results.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }
  }

  const value = {
    createQuiz,
    getPublicQuizzes,
    getMyQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    submitQuizResult,
    getMyResults,
    getQuizResults
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}
