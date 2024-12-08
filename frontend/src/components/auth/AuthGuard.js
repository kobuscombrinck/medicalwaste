import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, refreshToken } from '../../store/slices/authSlice';

const AuthGuard = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        try {
          await dispatch(refreshToken()).unwrap();
        } catch (error) {
          navigate('/login', {
            state: { from: location.pathname },
            replace: true,
          });
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, dispatch, navigate, location]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
