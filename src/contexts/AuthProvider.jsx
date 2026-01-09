import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';

const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // null initially
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Fetch user role from backend
  const fetchUserRole = async email => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/role/${email}`
      );
      setUserRole(data.role || 'user');
      return data.role || 'user';
    } catch (error) {
      console.error('Error fetching role:', error);
      setUserRole('user');
      return 'user';
    }
  };

  const register = async (email, password, name, photoURL = null) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL:
          photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=random`,
      });

      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        email,
        name,
        photoURL:
          photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=random`,
      });

      setUser(userCredential.user);
      await fetchUserRole(email); // fetch role after registration

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setUser(userCredential.user);
      await fetchUserRole(email);

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/social-login`,
        {
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL,
        }
      );

      setUser(result.user);
      await fetchUserRole(result.user.email);

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setUserRole(null);
      setToken(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        setUser(currentUser);

        const idToken = await currentUser.getIdToken();
        setToken(idToken);
        localStorage.setItem('token', idToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;

        await fetchUserRole(currentUser.email);
      } else {
        setUser(null);
        setUserRole(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        token,
        register,
        login,
        googleLogin,
        logout,
        fetchUserRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthProvider;
