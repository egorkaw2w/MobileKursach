import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: { fullName: string } | null;
  userId: number | null;
  login: (user: { fullName: string }, userId: number) => Promise<void>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ fullName: string } | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [storedUser, storedUserId] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('userId')
        ]);

        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedUserId) setUserId(parseInt(storedUserId));
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsAuthReady(true);
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    const saveAuthData = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem('user');
        }

        if (userId) {
          await AsyncStorage.setItem('userId', userId.toString());
        } else {
          await AsyncStorage.removeItem('userId');
        }
      } catch (error) {
        console.error('Error saving auth data:', error);
      }
    };

    saveAuthData();
  }, [user, userId]);

  const login = async (newUser: { fullName: string }, newUserId: number) => {
    setUser(newUser);
    setUserId(newUserId);
  };

  const logout = async () => {
    setUser(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ user, userId, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
