import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const request = axios.create({
    baseURL: baseURL,
});

// Interceptor để thêm accessToken vào mỗi yêu cầu Axios
request.interceptors.request.use(
    async (config) => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            // Điều hướng đến trang login nếu không có accessToken
            // const navigation = useNavigation();
            // navigation.navigate('Login');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default request;
