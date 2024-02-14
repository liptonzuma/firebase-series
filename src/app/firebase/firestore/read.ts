import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import app from '../../../../firebaseConfig';

const db = getFirestore(app);
const todosCollection = collection(db, 'todos');

export async function fetchOnlyMyTodoList(uid: string) {
  const myTodosQuery = query(todosCollection, where('ownerId', '==', uid));
  return await getDocs(myTodosQuery);
}
