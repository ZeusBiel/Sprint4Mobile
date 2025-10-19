import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../firebaseConfig';
import { ensureUserDocExists } from '../utils/firebaseOperations';

interface UserProfile {
  nome: string;
  capitalTotal: number;
  perfilInvestidor: string;
}

interface AuthContextData {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async (firebaseUser: User) => {
    if (!firebaseUser) return;
    try {
      console.log('Fetching profile for user:', firebaseUser.uid);
      const profile = await ensureUserDocExists(firebaseUser.uid, {
        nome: firebaseUser.displayName || 'Usuário',
        capitalTotal: 47000.0,
      });
      setUserProfile(profile as UserProfile);
      console.log('Profile loaded:', profile);
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserProfile]);

  const login = async (loggedInUser: User) => {
    setUser(loggedInUser);
    await fetchUserProfile(loggedInUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const refreshUserProfile = useCallback(async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  }, [user, fetchUserProfile]);

  const value = { user, userProfile, isLoading, login, logout, refreshUserProfile };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}