import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  userId: number | null;
  login: (user: User, userId: number) => Promise<void>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [userData, id] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('userId')
        ]);
        
        if(userData) setUser(JSON.parse(userData));
        if(id) setUserId(parseInt(id));
      } catch(error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsAuthReady(true);
      }
    };

    loadAuthData();
  }, []);

  const login = async (newUser: User, newUserId: number) => {
    setUser(newUser);
    setUserId(newUserId);
    await AsyncStorage.multiSet([
      ['user', JSON.stringify(newUser)],
      ['userId', newUserId.toString()]
    ]);
  };

  const logout = async () => {
    setUser(null);
    setUserId(null);
    await AsyncStorage.multiRemove(['user', 'userId']);
  };

  return (
    <AuthContext.Provider value={{ user, userId, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
