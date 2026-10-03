import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { initialUsers } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isResident: boolean;
  login: (email: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to the resident user for immediate interactive demonstration,
  // or restore from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pakhostel_current_user');
      return saved ? JSON.parse(saved) : initialUsers[2]; // Default to student resident
    } catch {
      return initialUsers[2];
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pakhostel_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pakhostel_current_user');
    }
  }, [currentUser]);

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await api.login(email);
      setCurrentUser(res.user);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const res = await api.register(userData);
      setCurrentUser(res.user);
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickSwitchRole = (role: UserRole) => {
    const found = initialUsers.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      setCurrentUser({
        id: `usr-custom-${Date.now()}`,
        name: `Demo ${role}`,
        email: `${role.toLowerCase().replace(/[^a-z]/g, '')}@pakhostel.pk`,
        phone: '+92 300 1122334',
        role,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const isAdmin = currentUser?.role === 'Super Admin' || currentUser?.role === 'Hostel Admin';
  const isManager = isAdmin || currentUser?.role === 'Manager';
  const isResident = currentUser?.role === 'Student/Resident';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin,
        isManager,
        isResident,
        login,
        register,
        logout,
        quickSwitchRole,
      }}
    >
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
