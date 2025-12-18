import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchCurrentUser,
  setAuthToken as applyAuthToken,
  setUnauthorizedHandler,
} from '../services/api';

const AuthContext = createContext(undefined);

const STORAGE_KEY = 'rechargex_token';

const readStoredToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => readStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(readStoredToken()));

  const persistToken = useCallback((value) => {
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      // no-op
    }
    applyAuthToken(value);
    setToken(value || null);
  }, []);

  const logout = useCallback(
    (options = { redirect: true }) => {
      persistToken(null);
      setUser(null);
      setLoading(false);
      if (options.redirect) {
        navigate('/login', { replace: true });
      }
    },
    [navigate, persistToken]
  );

  const handleUnauthorized = useCallback(() => {
    logout({ redirect: true });
  }, [logout]);

  useEffect(() => {
    setUnauthorizedHandler(() => handleUnauthorized);
  }, [handleUnauthorized]);

  useEffect(() => {
    applyAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetchCurrentUser()
      .then((response) => {
        if (!isMounted) return;
        const profile = response?.data?.data || response?.data?.user || response?.data;
        setUser(profile);
      })
      .catch(() => {
        if (!isMounted) return;
        logout();
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const hydrateProfile = useCallback(async () => {
    try {
      const response = await fetchCurrentUser();
      const profile = response?.data?.data || response?.data?.user || response?.data;
      setUser(profile);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const startSession = useCallback(
    (nextToken, profile) => {
      if (!nextToken) return;
      setLoading(true);
      persistToken(nextToken);
      if (profile) {
        setUser(profile);
        setLoading(false);
        return;
      }
      hydrateProfile();
    },
    [persistToken, hydrateProfile]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading: loading,
      startSession,
      hydrateProfile,
      setUser,
      logout,
    }),
    [token, user, loading, startSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
