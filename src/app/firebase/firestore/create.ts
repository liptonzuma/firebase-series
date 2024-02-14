import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
} from 'firebase/firestore';
import app from '../../../../firebaseConfig';

interface TodoItemInterface {
  todo: string;
  ownerId: string;
  isCompleted: boolean;
}

const db = getFirestore(app);
const todosCollection = collection(db, 'todos');

export async function createTodoTask(data: TodoItemInterface) {
  const dbData = {
    createdAt: Timestamp.now(),
    completedAt: '',
    ...data,
  };
  return await addDoc(todosCollection, dbData);
}
