import { getFirestore, collection, doc, updateDoc } from 'firebase/firestore';
import app from '../../../../firebaseConfig';

const db = getFirestore(app);
const todosCollection = collection(db, 'todos');

export async function updateTodoItem(docId: string, isCompleted: boolean) {
  const docRef = doc(todosCollection, docId);
  return await updateDoc(docRef, { isCompleted });
}
