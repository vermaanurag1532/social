import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/firebase/config/Firebase';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, loading] = useAuthState(auth);
  const user = authUser ?? null;

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
