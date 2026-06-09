import React, { createContext, useState, useMemo } from 'react';

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizResults, setQuizResults] = useState(null);

    const value = useMemo(() => ({
        currentQuiz,
        setCurrentQuiz,
        quizResults,
        setQuizResults
    }), [currentQuiz, quizResults]);

    return (
        <QuizContext.Provider value={value}>
            {children}
        </QuizContext.Provider>
    );
};
