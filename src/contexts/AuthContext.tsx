import React, { createContext, useContext, useState, ReactNode } from 'react';
import { db, User } from '@/lib/store';

export type UserRole = 'landlord' | 'caretaker' | 'tenant';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, pin: string) => Promise<boolean>;
  signUp: (data: SignUpData) => Promise<boolean>;
  logout: () => void;
}

interface SignUpData {
  fullName: string;
  phone: string;
  propertyName: string;
  pin: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (phone: string, pin: string): Promise<boolean> => {
    // Real "Local" Login
    await new Promise(resolve => setTimeout(resolve, 300)); // Small fake loading delay
    
    // Find user in local DB
    const foundUser = db.getUserByPhone(phone);

    if (foundUser && foundUser.pin === pin) {
        setUser(foundUser);
        return true;
    }
    
    // Fallback for demo if not found in DB (Optional, but cleaner to fail if strict)
    // console.log("User not found in local DB");
    return false;
  };

  const signUp = async (data: SignUpData): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: Date.now().toString(),
      fullName: data.fullName,
      phone: data.phone,
      propertyName: data.propertyName,
      role: 'landlord', // Default signup is landlord for now
      pin: data.pin,
      status: 'active'
    };

    db.addUser(newUser);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
