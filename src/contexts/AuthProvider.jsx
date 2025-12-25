// src/contexts/AuthProvider.jsx
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://bari-server-plum.vercel.app';

  // Fetch user role
  const fetchUserRole = async email => {
    try {
      console.log('🔍 Fetching role for:', email);
      const response = await axios.get(
        `${API_BASE_URL}/api/users/role/${email}`
      );

      console.log('✅ Role response:', response.data);

      if (response.data.success && response.data.role) {
        setUserRole(response.data.role);
        setUserData({
          role: response.data.role,
          isFraud: response.data.isFraud,
        });
        return response.data.role;
      }

      setUserRole('user');
      return 'user';
    } catch (err) {
      console.error('❌ Error fetching role:', err);
      setUserRole('user');
      return 'user';
    }
  };

  // Register user - FIXED
  const register = async (email, password, name, photoURL, role = 'user') => {
    console.log('🔵 [REGISTER] Role:', role, 'Email:', email);
    setLoading(true);

    try {
      // ✅ IMPORTANT: Prevent admin registration from frontend
      if (role === 'admin') {
        toast.error(
          'Admin registration is not allowed. Please register as user or vendor.'
        );
        throw new Error('Admin registration disabled');
      }

      // 1. Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. Update Firebase profile
      const finalPhotoURL =
        photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random`;

      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: finalPhotoURL,
      });

      // 3. Register in backend
      const backendUser = {
        email,
        name,
        photoURL: finalPhotoURL,
        role: role, // This can only be 'user' or 'vendor'
      };

      console.log('📤 Sending to backend:', backendUser);

      const response = await axios.post(
        `${API_BASE_URL}/api/users/register`,
        backendUser
      );

      console.log('✅ Backend response:', response.data);

      if (response.data.success) {
        const registeredRole = response.data.user?.role || role;
        setUserRole(registeredRole);
        setUserData(response.data.user);

        toast.success(`Registered successfully as ${registeredRole}!`);

        // Refresh role
        setTimeout(() => {
          fetchUserRole(email);
        }, 1000);

        return {
          userCredential,
          role: registeredRole,
          userData: response.data.user,
        };
      } else {
        toast.error(response.data.message || 'Registration failed');
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);

      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please login instead.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || 'Registration failed');
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Fetch role immediately
      const role = await fetchUserRole(email);

      toast.success('Login successful!');
      return { userCredential, role };
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const googleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();

      const backendUser = {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoURL:
          user.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.displayName || user.email
          )}&background=random`,
      };

      await axios.post(`${API_BASE_URL}/api/users/social-login`, backendUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const role = await fetchUserRole(user.email);

      toast.success('Google login successful!');
      return { result, role };
    } catch (err) {
      console.error('Google login error:', err);
      toast.error(err.message || 'Google login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      setUserData(null);
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed');
      throw err;
    }
  };

  // Auth state observer
  // AuthProvider.jsx-এ useEffect-এ
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      console.log('🔵 [AuthProvider] Auth state changed:', {
        email: currentUser?.email,
        uid: currentUser?.uid,
        timestamp: new Date().toISOString(),
      });

      setUser(currentUser);

      if (currentUser?.email) {
        await fetchUserRole(currentUser.email);
      } else {
        setUserRole(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      userRole,
      userData,
      loading,
      register,
      login,
      googleLogin,
      logout,
      fetchUserRole,
    }),
    [user, userRole, userData, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
