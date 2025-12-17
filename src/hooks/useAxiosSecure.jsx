import axios from 'axios';
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const instance = axios.create({
  baseURL: 'https://my-server-nu-ivory.vercel.app',
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { user, signOutUser } = useContext(AuthContext);

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      config => {
        const token = user?.accessToken;
        if (token) config.headers.authorization = `Bearer ${token}`;
        return config;
      },
      error => Promise.reject(error)
    );

    const responseInterceptor = instance.interceptors.response.use(
      res => res,
      error => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          console.log('Unauthorized - logging out');
          signOutUser().then(() => navigate('/register'));
        }
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, signOutUser, navigate]);

  return instance;
};

export default useAxiosSecure;
