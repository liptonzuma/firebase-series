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

const mediaCollection = collection(db, 'media');

export async function fetchOnlyMyTodoList(uid: string) {
  const myTodosQuery = query(todosCollection, where('ownerId', '==', uid));
  return await getDocs(myTodosQuery);
}

export async function fetchItemsBasedOnType(
  uid: string,
  fileType: 'image' | 'video'
) {
  const myMediaQuery = query(
    mediaCollection,
    where('ownerId', '==', uid),
    where('fileType', '==', fileType)
  );
  return await getDocs(myMediaQuery);
}
