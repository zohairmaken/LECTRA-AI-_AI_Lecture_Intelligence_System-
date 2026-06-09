import api from './api';

export const generateQuiz = async (lectureId, options = {}) => {
    const response = await api.post(`/quiz/${lectureId}/generate`, options);
    // Backend returns { id, questions } — return the full object
    return response.data;
};

export const getQuiz = async (id) => {
    const response = await api.get(`/quiz/${id}`);
    return response.data;
};

export const submitQuiz = async (quizId, answers) => {
    // answers = { "0": "A) option text", "1": "B) option text", ... }
    const response = await api.post(`/quiz/${quizId}/submit`, { answers });
    return response.data;
};

export const evaluateAnswer = async (lectureId, question, userAnswer) => {
    const response = await api.post(`/quiz/${lectureId}/evaluate`, {
        question: question,
        user_answer: userAnswer
    });
    return response.data;
};

export const getQuizHistory = async () => {
    const response = await api.get(`/quiz/history`);
    return response.data;
};
