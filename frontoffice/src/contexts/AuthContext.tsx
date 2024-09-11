import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import userService, { ApiError } from '../services/auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchUserData = async () => {
    const userId = userService.getStoredUserId();
    if (userId) {
      try {
        const userData = await userService.getUserById(userId);
        setUser(userData.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        setUser(null);
        setIsAuthenticated(false);
        userService.setStoredUserId(null);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await userService.login(username, password);
      console.log('Réponse de login:', response);
      
      if (response.statusCode === 200 || response.statusCode === 201) {
        // If the userId is not in the login response, we might need to fetch it separately
        if (!userService.getStoredUserId()) {
          // You might need to implement this method in userService
          const userIdResponse = await userService.getUserId();
          userService.setStoredUserId(userIdResponse.data);
        }
        await fetchUserData();
      } else {
        throw new Error(response.data.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur détaillée dans le contexte d\'authentification:', error);
      if (error instanceof ApiError) {
        throw new Error(`Échec de la connexion: ${error.message}`);
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Une erreur inattendue s\'est produite lors de la connexion');
      }
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
      setUser(null);
      setIsAuthenticated(false);
      userService.setStoredUserId(null);
    } catch (error) {
      console.error('Échec de la déconnexion:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};