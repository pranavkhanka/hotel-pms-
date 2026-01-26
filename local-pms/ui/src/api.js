import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export const getRooms = () => api.get('/rooms');
export const createBooking = (data) => api.post('/bookings', data);
export const createGuest = (data) => api.post('/guests', data);

export default api;
