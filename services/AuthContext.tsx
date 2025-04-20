import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  fullName: string;
  idRole?: number;
}

interface AuthContextType {
  user: User | null;
  userId: number | null;
  login: (user: User, userId: number) => Promise<void>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
  isCourierAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [storedUser, storedUserId] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('userId'),
        ]);

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && typeof parsedUser === 'object') {
              setUser(parsedUser);
            }
          } catch (e) {
            console.error('Invalid user data in AsyncStorage:', e);
          }
        }
        if (storedUserId) {
          const parsedId = parseInt(storedUserId);
          if (!isNaN(parsedId)) {
            setUserId(parsedId);
          }
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsAuthReady(true);
      }
    };

    loadAuthData();
  }, []);

  const login = async (newUser: User, newUserId: number) => {
    try {
      setUser(newUser);
      setUserId(newUserId);
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(newUser)],
        ['userId', newUserId.toString()],
      ]);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw new Error('Failed to login');
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setUserId(null);
      await AsyncStorage.multiRemove(['user', 'userId']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const isCourierAdmin = () => {
    return !!user && user.idRole === 6;
  };

  return (
    <AuthContext.Provider value={{ user, userId, login, logout, isAuthReady, isCourierAdmin }}>
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