import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { withRetry } from './errorHandling';
import { withOfflineSupport } from './offlineStorage';

export interface UserProfile {
  nome: string;
  capitalTotal: number;
  perfilInvestidor: string;
}

export interface Investment {
  id: string;
  nome: string;
  valor: number;
  tipo: string;
  dataCompra: string;
}

// User Profile Operations
export const getUserProfile = async (userId: string) => {
  return withOfflineSupport(
    `userProfile_${userId}`,
    async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await withRetry(() => getDoc(docRef));
      if (!docSnap.exists()) {
        throw new Error('Perfil não encontrado');
      }
      return docSnap.data() as UserProfile;
    }
  );
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  const docRef = doc(db, 'users', userId);
  await withRetry(() => updateDoc(docRef, data));
  await getUserProfile(userId); // Refresh cache
};

// Ensure user document exists (create default profile if missing)
export const ensureUserDocExists = async (userId: string, defaults: Partial<UserProfile> = {}) => {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    const defaultProfile: UserProfile = {
      nome: defaults.nome || 'Usuário',
      capitalTotal: defaults.capitalTotal ?? 0,
      perfilInvestidor: defaults.perfilInvestidor || 'Não definido',
    };
    await withRetry(() => setDoc(userRef, defaultProfile));
    return defaultProfile;
  }
  return snap.data() as UserProfile;
};

// Investment Operations
export const getUserInvestments = async (userId: string) => {
  return withOfflineSupport(
    `investments_${userId}`,
    async () => {
      const investmentsRef = collection(db, 'users', userId, 'investments');
      const querySnapshot = await withRetry(() => getDocs(investmentsRef));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Investment[];
    }
  );
};

export const addInvestment = async (userId: string, investment: Omit<Investment, 'id'>) => {
  const investmentsRef = collection(db, 'users', userId, 'investments');
  const newDoc = doc(investmentsRef);
  await withRetry(() => setDoc(newDoc, investment));
  await getUserInvestments(userId); // Refresh cache
};

export const updateInvestment = async (userId: string, investmentId: string, data: Partial<Investment>) => {
  const docRef = doc(db, 'users', userId, 'investments', investmentId);
  await withRetry(() => updateDoc(docRef, data));
  await getUserInvestments(userId); // Refresh cache
};

export const deleteInvestment = async (userId: string, investmentId: string) => {
  const docRef = doc(db, 'users', userId, 'investments', investmentId);
  await withRetry(() => deleteDoc(docRef));
  await getUserInvestments(userId); // Refresh cache
};

// Quiz Operations
export const saveQuizResults = async (userId: string, results: any) => {
  try {
    // Ensure user doc exists to avoid permission/structure issues
    await ensureUserDocExists(userId);
    const userDocRef = doc(db, 'users', userId);

    // Primeiro, tente atualizar o documento principal do usuário (mais provável de ter permissão)
    try {
      const payload: any = {
        perfilInvestidor: results.perfilInvestidor,
        quizResults: results,
        quizUpdatedAt: new Date().toISOString(),
      };
      await withRetry(() => updateDoc(userDocRef, payload));
      return;
    } catch (innerErr: any) {
      // Se for erro de permissão, iremos tentar gravar na subcoleção como fallback
      console.warn('updateDoc on user document failed, will try subcollection. Reason:', innerErr?.code || innerErr?.message);
      if (innerErr?.code && innerErr.code !== 'permission-denied') {
        // rethrow non-permission errors
        throw innerErr;
      }
      // continue to fallback write
    }

    // Fallback: escrever na subcoleção 'quiz/results'
    const docRef = doc(db, 'users', userId, 'quiz', 'results');
    // Use merge to avoid overwriting existing data
    await withRetry(() => setDoc(docRef, results, { merge: true } as any));
  } catch (err: any) {
    console.error('saveQuizResults error:', err);
    const e: any = new Error(err?.message || 'Erro ao salvar resultados do quiz');
    e.code = err?.code || 'SAVE_QUIZ_FAILED';
    throw e;
  }
};

export const getQuizResults = async (userId: string) => {
  return withOfflineSupport(
    `quiz_${userId}`,
    async () => {
      const docRef = doc(db, 'users', userId, 'quiz', 'results');
      const docSnap = await withRetry(() => getDoc(docRef));
      if (!docSnap.exists()) {
        return null;
      }
      return docSnap.data();
    }
  );
};