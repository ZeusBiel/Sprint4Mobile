import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../firebaseConfig"; // ajuste se seu arquivo exportar de outro nome
import { safeMessage, logError } from "../utils/errors";
import { validateLogin, validateRegister } from "../hooks/useValidation";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Ações
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOutApp: () => Promise<void>;

  // Utilidades
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "fb_id_token";

async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED, // iOS
  });
}

async function clearToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // ignore
  }
}

async function loadToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Observa sessão e renova token automaticamente
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u);
        setError(null);

        if (u) {
          // Força refresh do ID token (expira ~1h)
          const idToken = await u.getIdToken(true);
          await saveToken(idToken);
        } else {
          await clearToken();
        }
      } catch (e) {
        logError(e, "onAuthStateChanged");
        setError(safeMessage(e));
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    // Validação segura (evita requisição com dados inválidos)
    const v = validateLogin({ email, password });
    if (!v.valid) {
      setError("Verifique os campos de e-mail e senha.");
      return;
    }

    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await cred.user.getIdToken(true);
      await saveToken(token);
      setUser(cred.user);
    } catch (e) {
      logError(e, "signIn");
      setError(safeMessage(e));
      throw e; // opcional: propagar para UI mostrar modal
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setError(null);
    const v = validateRegister({ name, email, password });
    if (!v.valid) {
      setError("Confira nome, e-mail e senha (mínimo 8 caracteres).");
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const token = await cred.user.getIdToken(true);
      await saveToken(token);
      setUser(cred.user);

      // Se tiver Firestore/Realtime DB para perfil, você pode criar o doc aqui:
      // await setDoc(doc(db, "users", cred.user.uid), { name: name.trim(), createdAt: new Date().toISOString() });
    } catch (e) {
      logError(e, "signUp");
      setError(safeMessage(e));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signOutApp = async () => {
    try {
      setLoading(true);
      await clearToken();
      await signOut(auth);
      setUser(null);
    } catch (e) {
      logError(e, "signOut");
      setError(safeMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const getToken = async () => {
    // Carrega token atual do storage seguro (útil para chamadas a APIs próprias)
    return await loadToken();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      signIn,
      signUp,
      signOutApp,
      getToken,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
