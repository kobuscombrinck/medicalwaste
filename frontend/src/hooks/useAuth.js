import { useSelector, useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, status, error } = useSelector((state) => state.auth);

  const isAuthenticated = () => {
    return !!token;
  };

  const login = async (credentials) => {
    try {
      // Dispatch login action which will handle the API call
      await dispatch(loginAction(credentials)).unwrap();
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const getUser = () => {
    return user;
  };

  return {
    user,
    status,
    error,
    isAuthenticated,
    login,
    logout,
    getUser,
  };
};

export default useAuth;
