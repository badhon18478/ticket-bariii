// src/contexts/AuthContext.jsx
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
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Get auth token
  const getAuthToken = async () => {
    if (user) {
      try {
        return await user.getIdToken();
      } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
      }
    }
    return null;
  };

  // Save user to MongoDB
  const saveUserToMongoDB = async userData => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.error('No auth token available');
        return null;
      }

      const response = await axios.post(`${API_BASE_URL}/api/users`, userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ User saved to MongoDB:', response.data);
      return response.data;
    } catch (error) {
      // If user already exists, that's okay
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists in MongoDB');
        return { success: true, message: 'User already exists' };
      }
      console.error('❌ Error saving to MongoDB:', error);
      return null;
    }
  };

  // Fetch user role from backend
  const fetchUserRole = async email => {
    try {
      console.log('🔍 Fetching role for:', email);
      const response = await axios.get(
        `${API_BASE_URL}/api/users/role/${email}`
      );

      if (response.data.role) {
        console.log('✅ User role fetched:', response.data.role);
        setUserRole(response.data.role);
        setUserData(response.data);
        return response.data;
      } else {
        // Default to user
        setUserRole('user');
        return { role: 'user' };
      }
    } catch (error) {
      console.error('❌ Error fetching user role:', error);

      // Check default users
      const defaultUsers = {
        'admin@ticketbari.com': 'admin',
        'vendor@ticketbari.com': 'vendor',
        'user@ticketbari.com': 'user',
      };

      if (defaultUsers[email]) {
        setUserRole(defaultUsers[email]);
        return { role: defaultUsers[email] };
      }

      // Default to user
      setUserRole('user');
      return { role: 'user' };
    }
  };

  // Register user
  const register = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      console.log('📝 Starting registration for:', email);

      // 1. Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log('✅ Firebase registration successful');

      // 2. Update Firebase profile
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL:
          photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=random`,
      });

      // 3. Save to MongoDB
      const userData = {
        email: email,
        name: name,
        photoURL:
          photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=random`,
        role: 'user', // All new registrations are 'user' by default
      };

      await saveUserToMongoDB(userData);

      // 4. Fetch role
      await fetchUserRole(email);

      toast.success('Registration successful!');
      return userCredential;
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('🔑 Attempting login for:', email);

      // 1. Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log('✅ Firebase login successful');

      // 2. Fetch role from backend
      await fetchUserRole(email);

      toast.success('Login successful!');
      return userCredential;
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error(error.message);
      throw error;
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

      console.log('✅ Google login successful:', user.email);

      // Save user to MongoDB
      const userData = {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoURL:
          user.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.displayName || user.email
          )}&background=random`,
        role: 'user',
      };

      await saveUserToMongoDB(userData);

      // Fetch role
      await fetchUserRole(user.email);

      toast.success('Google login successful!');
      return result;
    } catch (error) {
      console.error('❌ Google login error:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUserRole(null);
      setUserData(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      toast.error('Logout failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      setUser({ ...auth.currentUser });

      // Also update in MongoDB
      const userData = {
        email: auth.currentUser.email,
        name: name,
        photoURL: photoURL,
        role: userRole || 'user',
      };

      await saveUserToMongoDB(userData);

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('❌ Profile update error:', error);
      toast.error('Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async email => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
    } catch (error) {
      console.error('❌ Password reset error:', error);
      toast.error('Failed to send reset email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Firebase auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      console.log('🔄 Auth state changed:', currentUser?.email);
      setUser(currentUser);

      if (currentUser?.email) {
        // Fetch role
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
      updateUserProfile,
      resetPassword,
      fetchUserRole,
      getAuthToken,
      API_BASE_URL,
    }),
    [user, userRole, userData, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
