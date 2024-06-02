import { useReducer } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

const AuthContext = createContext();

const initialValue = {
  user: null,
  isAuthenticated: false,
};

const reducer = function (state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'logout':
      return initialValue;
    default:
      throw new Error('Action type tidak tersedia.')
  }
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialValue
  );

  function login(e, email, password) {
    e.preventDefault();

    console.log(email,password)

    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: 'login', payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: 'logout' });
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(
      'Anda mengakses context di luar jangkauan provider, context hanya dapat diakses di dalam Provider component!'
    );

  return context;
}

export { useAuth, AuthProvider };
