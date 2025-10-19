import NetInfo from '@react-native-community/netinfo';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert(
          'Sem conexão',
          'Você está offline. Algumas funcionalidades podem estar limitadas.',
          [{ text: 'OK' }]
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ErrorBoundary>
  );
}