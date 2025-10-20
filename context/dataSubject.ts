import { auth } from "../firebaseConfig"; 
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const db = getFirestore();

export async function exportMyData(): Promise<any> {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");
  const userId = user.uid;

  const collectionsToExport = ["users", "consents", "quizResults", "history"];

  const exported: Record<string, any[]> = {};

  for (const colName of collectionsToExport) {
    try {
      const snap = await getDocs(collection(db, colName));
      const registros = snap.docs
        .filter((d) => d.id === userId || d.data().uid === userId)
        .map((d) => ({ id: d.id, ...d.data() }));
      exported[colName] = registros;
    } catch (err) {
      exported[colName] = [`Coleção '${colName}' não encontrada ou sem permissão.`];
    }
  }

  return {
    userId,
    exportedAt: new Date().toISOString(),
    data: exported,
  };
}

export async function deleteMyData(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");
  const userId = user.uid;

  const collectionsToDelete = ["users", "consents", "quizResults", "history"];

  for (const colName of collectionsToDelete) {
    try {
      const snap = await getDocs(collection(db, colName));
      for (const d of snap.docs) {
        if (d.id === userId || d.data().uid === userId) {
          await deleteDoc(doc(db, colName, d.id));
        }
      }
    } catch (err) {
      console.warn(`Não foi possível remover dados da coleção ${colName}`, err);
    }
  }

  await user.delete();
}
