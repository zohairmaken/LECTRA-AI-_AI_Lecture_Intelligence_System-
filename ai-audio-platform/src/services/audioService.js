import api from './api';

export const uploadAudio = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/lectures/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getAudioFile = async (id) => {
    const response = await api.get(`/audio/${id}`);
    return response.data;
}

export const getAllAudioFiles = async () => {
    const response = await api.get('/audio');
    return response.data;
}
