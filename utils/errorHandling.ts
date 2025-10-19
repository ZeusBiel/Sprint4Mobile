import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public retry?: () => Promise<void>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ERROR_MESSAGES = {
  NETWORK: 'Conexão com a internet perdida. Tente novamente.',
  FIREBASE_AUTH: 'Erro na autenticação. Por favor, tente novamente.',
  FIREBASE_DATA: 'Erro ao carregar dados. Tente novamente.',
  INPUT_VALIDATION: 'Por favor, verifique os dados inseridos.',
  UNKNOWN: 'Ocorreu um erro. Por favor, tente novamente.',
};

export const handleError = async (error: any, retry?: () => Promise<void>) => {
  console.error('Error:', error);

  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    showErrorAlert(
      'Sem conexão',
      ERROR_MESSAGES.NETWORK,
      retry
    );
    return;
  }

  if (error instanceof AppError) {
    showErrorAlert('Erro', error.message, error.retry || retry);
    return;
  }

  // Firebase Auth Errors
  if (error.code?.startsWith('auth/')) {
    const message = getFirebaseAuthErrorMessage(error.code);
    showErrorAlert('Erro de Autenticação', message, retry);
    return;
  }

  showErrorAlert('Erro', ERROR_MESSAGES.UNKNOWN, retry);
};

export const showErrorAlert = (
  title: string,
  message: string,
  retry?: () => Promise<void>
) => {
  Alert.alert(
    title,
    message,
    retry
      ? [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Tentar Novamente',
            onPress: () => retry(),
          },
        ]
      : [{ text: 'OK' }]
  );
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError;
};

const getFirebaseAuthErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Email inválido.';
    case 'auth/user-disabled':
      return 'Usuário desativado.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/email-already-in-use':
      return 'Email já está em uso.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    default:
      return ERROR_MESSAGES.FIREBASE_AUTH;
  }
};