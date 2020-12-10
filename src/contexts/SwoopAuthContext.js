import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer
} from 'react';
import jwtDecode from 'jwt-decode';
import * as QueryString from 'query-string'
import { useLocation } from 'react-router-dom'
import SplashScreen from 'src/components/SplashScreen';
import api from 'src/utils/api';


const initialAuthState = {
  isAttempting: false,
  isAuthenticated: false,
  isInitialised: false,
  user: null
};

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ATTEMPT_LOGIN': {
      return {
        ...state,
        isAttempting: true
      }
    }
    case 'INITIALISE': {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user
      };
    }
    case 'LOGIN': {
      const { user } = action.payload;

      return {
        ...state,
        isAttempting: false,
        isAuthenticated: true,
        user
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    }
    case 'REGISTER': {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user
      };
    }
    case 'UPDATE': {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        user
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: 'Swoop',
  login: () => Promise.resolve(),
  logout: () => { },
  magic: () => { },
  register: () => Promise.resolve(),
  updateSession: () => Promise.resolve(),
  updateUser: () => { },
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const { search } = useLocation()

  const params = QueryString.parse(search)

  const magic = () => {
    window.open(`${process.env.REACT_APP_API_BASE_URL}auth/swoop`, '_self')
  }

  const login = useCallback(async (code, state) => {
    dispatch({
      type: 'ATTEMPT_LOGIN',
    });

    const response = await api.get('/auth/swoop/callback', {
      params: {
        code,
        state
      }
    });
    const { accessToken, user } = response.data;

    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  }, []);

  useEffect(() => {
    const { code, state: authState } = params

    if (code && authState && !state.isAuthenticated  && !state.isAttempting) {
      login(code, authState)
    }
  }, [login, params, state])

  const logout = () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, name, password) => {
    const response = await api.post('/api/account/register', {
      email,
      name,
      password
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  const updateSession = async (accessToken) => {
    if (accessToken && isValidToken(accessToken)) {
      setSession(accessToken);

      const response = await api.get('/user/me');
      const user = response.data;

      dispatch({
        type: 'UPDATE',
        payload: {
          isAuthenticated: true,
          user
        }
      });
    } else {
      dispatch({
        type: 'UPDATE',
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }

  const updateUser = user => {
    dispatch({
      type: 'UPDATE',
      payload: {
        isAuthenticated: state.isAuthenticated,
        user
      }
    });
  }

  useEffect(() => {
    const initialise = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await api.get('/user/me');
          const user = response.data;

          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALISE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialise();
  }, []);

  if (!state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'Swoop',
        login,
        logout,
        magic,
        register,
        updateSession,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;