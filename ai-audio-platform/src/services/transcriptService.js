import api from './api';

export const getTranscripts = async () => {
    const response = await api.get('lectures/');
    return response.data;
};

export const getTranscript = async (id) => {
    const response = await api.get(`lectures/${id}`);
    return response.data;
};

export const updateTranscript = async (id, data) => {
    const response = await api.put(`/transcripts/${id}`, data);
    return response.data;
};
