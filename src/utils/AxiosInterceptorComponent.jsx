import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AxiosInterceptorComponent = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response.status === 403) {
                    navigate('/client-login');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate]);

    return <>{children}</>;
};

export default AxiosInterceptorComponent;
