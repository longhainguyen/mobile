import axios from 'axios';
const baseURL = process.env.EXPO_PUBLIC_API_URL;
const request = axios.create({
    baseURL: baseURL,
});

export default request;
