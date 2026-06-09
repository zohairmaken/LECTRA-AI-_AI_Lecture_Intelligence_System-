import api from './api';

export const getEvaluation = async (quizId) => {
    const response = await api.get(`/evaluations/${quizId}`);
    return response.data;
}
