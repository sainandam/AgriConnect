import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole, username: string) => Promise<boolean>;
  logout: () => void;
  acceptTerms: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Fetch latest terms acceptance status from the registry
      const termsRegistry = JSON.parse(localStorage.getItem('users_terms_accepted') || '{}');
      const termsAccepted = !!termsRegistry[`${parsedUser.email}:${parsedUser.role}`];
      setUser({
        ...parsedUser,
        terms_accepted: termsAccepted,
      });
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole, username: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    // Demo users: farmer@demo.com / owner@demo.com, password: demo123
    const demoUsers: Record<string, User> = {
      'farmer@demo.com': {
        id: '1',
        email: 'farmer@demo.com',
        name: 'John Farmer',
        role: 'farmer',
      },
      'owner@demo.com': {
        id: '2',
        email: 'owner@demo.com',
        name: 'Jane Owner',
        role: 'owner',
      },
    };

    const termsRegistry = JSON.parse(localStorage.getItem('users_terms_accepted') || '{}');
    const termsAccepted = !!termsRegistry[`${email}:${role}`];

    if (demoUsers[email] && password === 'demo123' && demoUsers[email].role === role) {
      // Update demo user with provided username if different
      const loggedUser: User = { 
        ...demoUsers[email], 
        name: username || demoUsers[email].name,
        terms_accepted: termsAccepted
      };
      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      return true;
    }

    // Allow any email/password combination for demo purposes
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: username,
      role,
      terms_accepted: termsAccepted
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const acceptTerms = () => {
    if (user) {
      const updatedUser = { ...user, terms_accepted: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Persist in the users_terms_accepted registry
      const termsRegistry = JSON.parse(localStorage.getItem('users_terms_accepted') || '{}');
      termsRegistry[`${user.email}:${user.role}`] = true;
      localStorage.setItem('users_terms_accepted', JSON.stringify(termsRegistry));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, acceptTerms, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};


